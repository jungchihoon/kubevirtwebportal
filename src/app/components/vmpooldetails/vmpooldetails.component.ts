import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { KubeVirtVM } from 'src/app/models/kube-virt-vm.model';
import { KubeVirtVMI } from 'src/app/models/kube-virt-vmi.model';
import { KubeVirtVMPool } from 'src/app/models/kube-virt-vmpool.model';
import { LivenessProbe } from 'src/app/models/liveness-probe.model';
import { ReadinessProbe } from 'src/app/models/readiness-probe.model';
import { K8sApisService } from 'src/app/services/k8s-apis.service';
import { KubeVirtService } from 'src/app/services/kube-virt.service';
import { Probe } from 'src/app/templates/probe.apitemplate';

@Component({
  selector: 'app-vmpooldetails',
  templateUrl: './vmpooldetails.component.html',
  styleUrls: ['./vmpooldetails.component.css']
})
export class VmpooldetailsComponent implements OnInit {

    poolName: string = "";
    poolNamespace: string = "";
    poolNetwork = {
        name: "",
        type: "",
        network: ""
    };

    activePool: KubeVirtVMPool = new KubeVirtVMPool;
    vmList: KubeVirtVM[] = [];
    customTemplate: boolean = false;
    thisLivenessType: string = "";
    thisReadinessType: string = "";
    myVmPoolReadinessProbe = new Probe().readinessProbe;
    myVmPoolLivenessProbe = new Probe().livenessProbe;

    /* Liveness form */
    selectedLivenessType: any;
    inputLivenessPath: any;
    inputLivenessPort: any;
    inputLivenessDelay: any;
    inputLivenessInterval: any;
    inputLivenessTimeout: any;
    inputLivenessFailure: any;
    inputLivenessSuccess: any;

    /* Readiness form */
    selectedReadinessType: any;
    inputReadinessPath: any;
    inputReadinessPort: any;
    inputReadinessDelay: any;
    inputReadinessInterval: any;
    inputReadinessTimeout: any;
    inputReadinessFailure: any;
    inputReadinessSuccess: any;

    /* Disk Information */
    hasDisk1: boolean = false;
    hasDisk2: boolean = false;
    disk1Info = {
        "name": "",
        "namespace": "",
        "type": "",
        "backend": "",
        "dataVolumeName": "",
        "dataVolumeNamespace": "",
        "dataVolumeSource": "",
        "dataVolumeSourceValue": "",
        "accessMode": "",
        "cacheMode": "",
        "capacity":  "",
        "storageClass": ""

    };

    disk2Info = {
        "name": "",
        "namespace": "",
        "type": "",
        "backend": "",
        "dataVolumeName": "",
        "dataVolumeNamespace": "",
        "dataVolumeSource": "",
        "dataVolumeSourceValue": "",
        "accessMode": "",
        "cacheMode": "",
        "capacity":  "",
        "storageClass": ""

    };

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private k8sApisService: K8sApisService,
        private kubeVirtService: KubeVirtService
    ) { }

    async ngOnInit(): Promise<void> {
        this.poolName = this.route.snapshot.params['name'];
        this.poolNamespace = this.route.snapshot.params['namespace'];
        await this.loadPool();
        let navTitle = document.getElementById("nav-title");
        if(navTitle != null) {
            navTitle.replaceChildren("Virtual Machine Pool Details");
        }
    }

    /*
     * Load VM Pool
     */
    async loadPool(): Promise<void> {
        const data = await lastValueFrom(this.kubeVirtService.getVMPool(this.poolNamespace, this.poolName));

        this.activePool = new KubeVirtVMPool();
        this.activePool.name = data.metadata["name"];
        this.activePool.namespace = data.metadata["namespace"];
        if(data.metadata.labels != null) {
            this.activePool.labels = data.metadata.labels;
        }
        this.activePool.creationTimestamp = new Date(data.metadata["creationTimestamp"]);
        this.activePool.replicas = data.spec["replicas"];
        this.activePool.running = data.spec.virtualMachineTemplate.spec["running"];
        /* Getting VM Type */
        try {
            this.activePool.instType = data.spec.virtualMachineTemplate.spec.instancetype.name;
            this.customTemplate = false;
        } catch(e: any) {
            this.activePool.instType = "custom";
            this.customTemplate = true;
            console.log(e);
        }

        /* Getting Ready Replicas */
        if(data.status["readyReplicas"] != null) {
            this.activePool.readyReplicas = Number(data.status["readyReplicas"]) || 0;
        }

        /* Liveness Probe */
        if(data.spec.virtualMachineTemplate.spec.template.spec["livenessProbe"] != null) {
            let thisLivenessProbe = new LivenessProbe;
            thisLivenessProbe.failureThreshold = data.spec.virtualMachineTemplate.spec.template.spec.livenessProbe["failureThreshold"];
            thisLivenessProbe.initDelaySeconds = data.spec.virtualMachineTemplate.spec.template.spec.livenessProbe["initialDelaySeconds"];
            thisLivenessProbe.periodSeconds = data.spec.virtualMachineTemplate.spec.template.spec.livenessProbe["periodSeconds"];
            thisLivenessProbe.successThreshold = data.spec.virtualMachineTemplate.spec.template.spec.livenessProbe["successThreshold"];
            thisLivenessProbe.timeoutSeconds = data.spec.virtualMachineTemplate.spec.template.spec.livenessProbe["timeoutSeconds"];
            this.inputLivenessFailure = thisLivenessProbe.failureThreshold;
            this.inputLivenessDelay = thisLivenessProbe.initDelaySeconds;
            this.inputLivenessInterval = thisLivenessProbe.periodSeconds;
            this.inputLivenessSuccess = thisLivenessProbe.successThreshold;
            this.inputLivenessTimeout = thisLivenessProbe.timeoutSeconds;
            if(data.spec.virtualMachineTemplate.spec.template.spec.livenessProbe["httpGet"] != null ) {
                this.thisLivenessType = "http";
                this.selectedLivenessType = "http";
                thisLivenessProbe.httpGet.path = data.spec.virtualMachineTemplate.spec.template.spec.livenessProbe.httpGet["path"];
                thisLivenessProbe.httpGet.port = data.spec.virtualMachineTemplate.spec.template.spec.livenessProbe.httpGet["port"];
                this.inputLivenessPath = thisLivenessProbe.httpGet.path;
                this.inputLivenessPort = thisLivenessProbe.httpGet.port;
            } else {
                this.thisLivenessType = "tcp";
                this.selectedLivenessType = "tcp";
                thisLivenessProbe.tcpSocket.port = data.spec.virtualMachineTemplate.spec.template.spec.livenessProbe.tcpSocket["port"];
                this.inputLivenessPort = thisLivenessProbe.tcpSocket.port;
            }
            this.activePool.livenessProbe = thisLivenessProbe;
            this.activePool.hasLiveness = true;
        }

        /* Readiness Probe */
        if(data.spec.virtualMachineTemplate.spec.template.spec["readinessProbe"] != null) {
            let thisReadinessProbe = new ReadinessProbe;
            thisReadinessProbe.failureThreshold = data.spec.virtualMachineTemplate.spec.template.spec.readinessProbe["failureThreshold"];
            thisReadinessProbe.initDelaySeconds = data.spec.virtualMachineTemplate.spec.template.spec.readinessProbe["initialDelaySeconds"];
            thisReadinessProbe.periodSeconds = data.spec.virtualMachineTemplate.spec.template.spec.readinessProbe["periodSeconds"];
            thisReadinessProbe.successThreshold = data.spec.virtualMachineTemplate.spec.template.spec.readinessProbe["successThreshold"];
            thisReadinessProbe.timeoutSeconds = data.spec.virtualMachineTemplate.spec.template.spec.readinessProbe["timeoutSeconds"];
            this.inputReadinessFailure = thisReadinessProbe.failureThreshold;
            this.inputReadinessDelay = thisReadinessProbe.initDelaySeconds;
            this.inputReadinessInterval = thisReadinessProbe.periodSeconds;
            this.inputReadinessSuccess = thisReadinessProbe.successThreshold;
            this.inputReadinessTimeout = thisReadinessProbe.timeoutSeconds;
            if(data.spec.virtualMachineTemplate.spec.template.spec.readinessProbe["httpGet"] != null ) {
                this.thisReadinessType = "http";
                this.selectedReadinessType = "http";
                thisReadinessProbe.httpGet.path = data.spec.virtualMachineTemplate.spec.template.spec.readinessProbe.httpGet["path"];
                thisReadinessProbe.httpGet.port = data.spec.virtualMachineTemplate.spec.template.spec.readinessProbe.httpGet["port"];
                this.inputReadinessPath = thisReadinessProbe.httpGet.path;
                this.inputReadinessPort = thisReadinessProbe.httpGet.port;
            } else {
                this.thisReadinessType = "tcp";
                this.selectedReadinessType = "tcp";
                thisReadinessProbe.tcpSocket.port = data.spec.virtualMachineTemplate.spec.template.spec.readinessProbe.tcpSocket["port"];
                this.inputReadinessPort = thisReadinessProbe.tcpSocket.port;
            }
            this.activePool.readinessProbe = thisReadinessProbe;
            this.activePool.hasReadiness = true;
        }

        if(this.activePool.instType == "custom") {
            /* Custom VM has cpu / mem parameters */
            this.activePool.cores = data.spec.virtualMachineTemplate.spec.template.spec.domain.cpu["cores"];
            this.activePool.sockets = data.spec.virtualMachineTemplate.spec.template.spec.domain.cpu["sockets"];
            this.activePool.threads = data.spec.virtualMachineTemplate.spec.template.spec.domain.cpu["threads"];
            this.activePool.memory = data.spec.virtualMachineTemplate.spec.template.spec.domain.resources.requests["memory"];
        } else {
            /* load vCPU / Mem from type */
            try {
                const data = await lastValueFrom(this.kubeVirtService.getClusterInstanceType(this.activePool.instType));
                this.activePool.cores = data.spec.cpu["guest"];
                this.activePool.memory = data.spec.memory["guest"];
                this.activePool.sockets = 1;
                this.activePool.threads = 1;
            } catch (e: any) {
                this.activePool.sockets = 0;
                this.activePool.threads = 0;
                this.activePool.cores = 0;
                this.activePool.memory = "";
                console.log(e);
            }
        }
        try {
            this.activePool.priorityClass = data.spec.virtualMachineTemplate.spec.template.spec.priorityClassName;
        } catch (e: any) {
            this.activePool.priorityClass = "";
            console.log(e);
        }

        this.poolNetwork.name = data.spec.virtualMachineTemplate.spec.template.spec.domain.devices.interfaces[0].name;
        try {
            this.poolNetwork.network = data.spec.virtualMachineTemplate.spec.template.spec.networks[0].multus.networkName;
        } catch (e: any) {
            this.poolNetwork.network = "podNetwork";
            console.log(e);
        }

        try {
            if(data.spec.virtualMachineTemplate.spec.template.spec.domain.devices.interfaces[0].masquerade != null) {
                this.poolNetwork.type = "masquerade";
            } else {
                this.poolNetwork.type = "bridge";
            }
        } catch (e: any) {
            this.poolNetwork.type = "bridge";
            console.log(e);
        }

        /* Load Disks */
        this.loadDiskInfo(data.spec.virtualMachineTemplate);

        await this.getPoolVM(this.activePool.namespace, this.activePool.name);
        this.activePool.vmlist = this.vmList;
        this.activePool = this.activePool;
    }

    /*
     * Load VM List
     */
    async getPoolVM(namespace: string, poolName: string): Promise<void> {
        this.vmList = [];
        let currentVm = new KubeVirtVM;
        const data = await lastValueFrom(this.kubeVirtService.getPooledVM(namespace, poolName));
        let vms = data.items;
        for (let i = 0; i < vms.length; i++) {
            currentVm = new KubeVirtVM();
            currentVm.name = vms[i].metadata["name"];
            currentVm.namespace = vms[i].metadata["namespace"];
            if(vms[i].metadata["labels"] != null) {
                currentVm.labels = Object.entries(vms[i].metadata.labels);
            }
            currentVm.creationTimestamp = new Date(vms[i].metadata["creationTimestamp"]);
            currentVm.running = vms[i].spec["running"];
            currentVm.status = vms[i].status["printableStatus"];
            if (currentVm.status.toLowerCase() == "running") {
                currentVm.running = true;
            }
            try {
                currentVm.nodeSel = vms[i].spec.template.spec.nodeSelector["kubernetes.io/hostname"];
            } catch (e: any) {
                currentVm.nodeSel = "auto-select";
                console.log(e);
            }

            /* Getting VM Type */
            try {
                currentVm.instType = vms[i].spec.instancetype.name;
            } catch(e: any) {
                currentVm.instType = "custom";
                console.log(e);
            }

            if(currentVm.instType == "custom") {
                /* Custom VM has cpu / mem parameters */
                currentVm.cores = vms[i].spec.template.spec.domain.cpu["cores"];
                currentVm.sockets = vms[i].spec.template.spec.domain.cpu["sockets"];
                currentVm.threads = vms[i].spec.template.spec.domain.cpu["threads"];
                currentVm.memory = vms[i].spec.template.spec.domain.resources.requests["memory"];
            } else {
                /* load vCPU / Mem from type */
                try {
                    const data = await lastValueFrom(this.kubeVirtService.getClusterInstanceType(currentVm.instType));
                    currentVm.cores = data.spec.cpu["guest"];
                    currentVm.memory = data.spec.memory["guest"];
                    currentVm.sockets = 1;
                    currentVm.threads = 1;
                } catch (e: any) {
                    currentVm.sockets = 0;
                    currentVm.threads = 0;
                    currentVm.cores = 0;
                    currentVm.memory = "";
                    console.log(e);
                }
            }

            if(vms[i].status["ready"] != null) {
                currentVm.ready = vms[i].status["ready"];
            }

            if(currentVm.running && currentVm.status && vms[i].status["printableStatus"].toLowerCase() == "running") {
                let currentVmi = new KubeVirtVMI;
                try {
                    const datavmi = await lastValueFrom(this.kubeVirtService.getVMi(currentVm.namespace, currentVm.name));
                    currentVmi = new KubeVirtVMI();
                    currentVmi.name = datavmi.metadata["name"];
                    currentVmi.namespace = datavmi.metadata["namespace"];
                    if(datavmi.metadata["labels"] != null) {
                        currentVmi.labels = Object.entries(datavmi.metadata["labels"]);
                    }
                    currentVmi.creationTimestamp = new Date(datavmi.metadata["creationTimestamp"]);
                    currentVmi.osId = datavmi.status.guestOSInfo["id"];
                    currentVmi.osKernRel = datavmi.status.guestOSInfo["kernelRelease"];
                    currentVmi.osKernVer = datavmi.status.guestOSInfo["kernelVersion"];
                    currentVmi.osName = datavmi.status.guestOSInfo["name"];
                    currentVmi.osPrettyName = datavmi.status.guestOSInfo["prettyName"];
                    currentVmi.osVersion = datavmi.status.guestOSInfo["version"];

                    /* Only works with guest-agent installed */
                    try {
                        currentVm.nodeSel = datavmi.status["nodeName"];
                        currentVmi.ifAddr = datavmi.status.interfaces[0]["ipAddress"];
                        currentVmi.ifName = datavmi.status.interfaces[0]["name"];
                    } catch(e: any) {
                        currentVmi.ifAddr = "";
                        currentVmi.ifName = "";
                        console.log(e);
                    }

                    currentVmi.nodeName = datavmi.status["nodeName"];
                    currentVm.vmi = currentVmi;
                } catch (e: any) {
                    console.log(e);
                    console.log("ERROR Retrieving VMI: " + currentVm.name + "-" + currentVm.namespace + ":" + currentVm.status);
                }
            }
            this.vmList.push(currentVm);
        }
    }

    /*
     * Load Disk Info
     */
    loadDiskInfo(virtualMachineTemplate: any): void {
        let all_disks = virtualMachineTemplate.spec.template.spec.domain.devices.disks;
        let all_volumes = virtualMachineTemplate.spec.template.spec.volumes;
        /* Find Disk */
        for (let i = 0; i < all_disks.length; i++) {
            let thisDiskInfo = {
                "name": "",
                "namespace": "",
                "type": "",
                "backend": "",
                "dataVolumeName": "",
                "dataVolumeNamespace": "",
                "dataVolumeSource": "",
                "dataVolumeSourceValue": "",
                "accessMode": "",
                "cacheMode": "",
                "capacity":  "",
                "storageClass": ""
        
            };
            thisDiskInfo.name = all_disks[i].name;
            thisDiskInfo.cacheMode = all_disks[i].cache;
            let keys = Object.keys(all_disks[i]);
            for (let j = 0; j < keys.length; j++) {
                if(keys[j].toLowerCase() != "name") {
                    thisDiskInfo.type = keys[j];
                }
            }
            /* Find Volume related to the Disk */
            for (let k = 0; k < all_volumes.length; k++) {
                if(all_volumes[k].name == thisDiskInfo.name) {
                    let volume_keys = Object.keys(all_volumes[k]);
                    for(let l = 0; l < volume_keys.length; l++) {
                        if(volume_keys[l].toLowerCase() != "name") {
                            if(volume_keys[l].toLowerCase() == "datavolume") {
                                thisDiskInfo.backend = volume_keys[l];
                                thisDiskInfo.dataVolumeName = all_volumes[k].dataVolume.name;
                            }
                        }
                    }
                }
            }

            /* Fetching Data Volume Template */
            if(thisDiskInfo.backend.toLowerCase() == "datavolume") {
                for(let j = 0; j < virtualMachineTemplate.spec.dataVolumeTemplates.length ; j++) {
                    let this_dv = virtualMachineTemplate.spec.dataVolumeTemplates[j];
                    if (this_dv.metadata.name == thisDiskInfo.dataVolumeName) {
                        thisDiskInfo.namespace = this_dv.metadata.namespace;
                        thisDiskInfo.dataVolumeNamespace = this_dv.metadata.namespace;
                        thisDiskInfo.accessMode = this_dv.spec.pvc.accessModes[0];
                        thisDiskInfo.capacity = this_dv.spec.pvc.resources.requests["storage"];
                        thisDiskInfo.storageClass = this_dv.spec.pvc["storageClassName"];
                        let this_source_keys = Object.keys(this_dv.spec.source);
                        for(let k = 0; k <  this_source_keys.length; k++) {
                            let this_key = this_source_keys[k];
                            switch (this_key) {
                                case "blank": 
                                    thisDiskInfo.dataVolumeSource = "blank";
                                    thisDiskInfo.dataVolumeSourceValue = "";
                                    break;
                                case "s3":
                                    thisDiskInfo.dataVolumeSource = "s3";
                                    thisDiskInfo.dataVolumeSourceValue = virtualMachineTemplate.spec.dataVolumeTemplates[j].spec.source.s3.url;
                                    break;
                                case "gcs":
                                    thisDiskInfo.dataVolumeSource = "gcs";
                                    thisDiskInfo.dataVolumeSourceValue = virtualMachineTemplate.spec.dataVolumeTemplates[j].spec.source.gcs.url;
                                    break;
                                case "http":
                                    thisDiskInfo.dataVolumeSource = "http";
                                    thisDiskInfo.dataVolumeSourceValue = virtualMachineTemplate.spec.dataVolumeTemplates[j].spec.source.http.url;
                                    break;
                                case "registry":
                                    thisDiskInfo.dataVolumeSource = "registry";
                                    thisDiskInfo.dataVolumeSourceValue = virtualMachineTemplate.spec.dataVolumeTemplates[j].spec.source.registry.url;
                                    break;
                                case "pvc":
                                    thisDiskInfo.dataVolumeSource = "pvc";
                                    thisDiskInfo.dataVolumeSourceValue = virtualMachineTemplate.spec.dataVolumeTemplates[j].spec.source.pvc.namespace + " - " + virtualMachineTemplate.spec.dataVolumeTemplates[j].spec.source.pvc.name;
                                    break;
                            }
                        }
                    }
                }
            }

            /* Set the flag, and load disk info */
            if(thisDiskInfo.name == "disk1") {
                this.hasDisk1 = true;
                this.disk1Info = thisDiskInfo;
            } else if (thisDiskInfo.name == "disk2") {
                this.hasDisk2 = true;
                this.disk2Info = thisDiskInfo;
            }
        }
    }

    /*
     * Show Delete VM Window
     */
    showDeleteVM(vmName: string, vmNamespace: string): void {
        let modalDiv = document.getElementById("modal-deletevm");
        let modalTitle = document.getElementById("deletevm-title");
        let modalBody = document.getElementById("deletevm-value");
        if(modalTitle != null) {
            modalTitle.replaceChildren("Delete");
        }
        if(modalBody != null) {
            let vmNameInput = document.getElementById("deletevm-name");
            let vmNamespaceInput = document.getElementById("deletevm-namespace");
            if(vmNameInput != null && vmNamespaceInput != null) {
                vmNameInput.setAttribute("value", vmName);
                vmNamespaceInput.setAttribute("value", vmNamespace);
                modalBody.replaceChildren("Are you sure you want to delete " + vmName + " on namespace: " + vmNamespace + "?");
            }
        }
        if(modalDiv != null) {
            modalDiv.setAttribute("class", "modal fade show");
            modalDiv.setAttribute("aria-modal", "true");
            modalDiv.setAttribute("role", "dialog");
            modalDiv.setAttribute("aria-hidden", "false");
            modalDiv.setAttribute("style","display: block;");
        }
    }

    /*
     * Remove VM From Pool
     */
    async removeVmFromPool(vmNamespace: string, vmName: string, vmNode: string) {
        try {
            const data = await lastValueFrom(this.kubeVirtService.removeVmFromPool(vmNamespace, vmName, vmNode));
            this.reloadComponent();
        } catch (e: any) {
            alert(e.error.message);
            console.log(e);
        }
    }


    /*
     * Delete Virtual Machine
     */
    async applyDeleteVM(): Promise<void> {
        let vmNameInput = document.getElementById("deletevm-name");
        let vmNamespaceInput = document.getElementById("deletevm-namespace");
        if(vmNameInput != null && vmNamespaceInput != null) {
            let vmName = vmNameInput.getAttribute("value");
            let vmNamespace = vmNamespaceInput.getAttribute("value");
            if(vmName != null && vmNamespace != null) {
                try {
                    const data = await lastValueFrom(this.kubeVirtService.deleteVm(vmNamespace, vmName));
                    this.hideComponent("modal-deletevm");
                    this.reloadComponent();
                } catch (e) {
                    console.log(e);
                }
            }
        }
    }

    /*
     * Hide Component
     */
    hideComponent(divId: string): void {
        let modalDiv = document.getElementById(divId);
        if(modalDiv != null) {
            modalDiv.setAttribute("class", "modal fade");
            modalDiv.setAttribute("aria-modal", "false");
            modalDiv.setAttribute("role", "");
            modalDiv.setAttribute("aria-hidden", "true");
            modalDiv.setAttribute("style","display: none;");
        }
    }

    /*
     * Show Replicas Window
     */
    showReplicas(): void {
        let modalDiv = document.getElementById("modal-replicas");
        if(modalDiv != null) {
            modalDiv.setAttribute("class", "modal fade show");
            modalDiv.setAttribute("aria-modal", "true");
            modalDiv.setAttribute("role", "dialog");
            modalDiv.setAttribute("aria-hidden", "false");
            modalDiv.setAttribute("style","display: block;");
        }
    }

    /*
     * Perform Resize of VM Pool
     */
    async applyReplicas(poolNamespace: string, poolName: string, replicasSize: string): Promise<void> {
        if(replicasSize != null && poolName != null && poolNamespace != null) {
            try {
                const data = await lastValueFrom(this.kubeVirtService.scalePoolReplicas(poolNamespace, poolName, replicasSize));
                this.hideComponent("modal-resize");
                this.reloadComponent();
            } catch (e: any) {
               alert(e.error.message);
               console.log(e);
            }
        }
    }

    /*
     * Show Pool Type Window
     */
    async showType(): Promise<void> {
        let modalDiv = document.getElementById("modal-type");
        let selectorTypeFiled = document.getElementById("changepool-type");
        let typeSelectorOptions = "";
        let data = await lastValueFrom(this.kubeVirtService.getClusterInstanceTypes());
        for (let i = 0; i < data.items.length; i++) {
            typeSelectorOptions += "<option value=" + data.items[i].metadata["name"] +">" + data.items[i].metadata["name"] + "</option>\n";
        }
        if (selectorTypeFiled != null) {
            selectorTypeFiled.innerHTML = typeSelectorOptions;
        }
        if(modalDiv != null) {
            modalDiv.setAttribute("class", "modal fade show");
            modalDiv.setAttribute("aria-modal", "true");
            modalDiv.setAttribute("role", "dialog");
            modalDiv.setAttribute("aria-hidden", "false");
            modalDiv.setAttribute("style","display: block;");
        }
    }

    /*
     * Change Pool Type
     */
    async applyType(poolNamespace: string, poolName: string, poolType: string): Promise<void> {
        try {
            const data = await lastValueFrom(this.kubeVirtService.changePoolType(poolNamespace, poolName, poolType));
            this.hideComponent("modal-type");
            this.reloadComponent();
        } catch (e: any) {
            alert(e.error.message);
            console.log(e);
        }
    }

    /*
     * Show Resize Pool Window
     */
    showResize(poolSockets: number, poolCores: number, poolThreads: number, poolMemory: string): void {
        let modalDiv = document.getElementById("modal-resize");
        let resizeSocketsField = document.getElementById("resize-sockets");
        let resizeCoresField = document.getElementById("resize-cores");
        let resizeThreadsField = document.getElementById("resize-threads");
        let resizeMemoryField = document.getElementById("resize-memory");
        if(resizeSocketsField != null && resizeCoresField != null && resizeThreadsField != null && resizeMemoryField != null) {
            resizeSocketsField.setAttribute("placeholder", poolSockets.toString());
            resizeCoresField.setAttribute("placeholder", poolCores.toString());
            resizeThreadsField.setAttribute("placeholder", poolThreads.toString());
            resizeMemoryField.setAttribute("placeholder", poolMemory.toString());
            resizeSocketsField.setAttribute("value", poolSockets.toString());
            resizeCoresField.setAttribute("value", poolCores.toString());
            resizeThreadsField.setAttribute("value", poolThreads.toString());
            resizeMemoryField.setAttribute("value", poolMemory.replace("Gi", "").toString());
        }
        if(modalDiv != null) {
            modalDiv.setAttribute("class", "modal fade show");
            modalDiv.setAttribute("aria-modal", "true");
            modalDiv.setAttribute("role", "dialog");
            modalDiv.setAttribute("aria-hidden", "false");
            modalDiv.setAttribute("style","display: block;");
        }
    }

    /*
     * Resize Virtual Machine Pool
     */
    async applyResize(resizeNamespace: string, resizeName: string, sockets: string, cores: string, threads: string, memory: string): Promise<void> {
        if(sockets != "" && cores != "" && threads != "" && memory != "") {
            try {
                const data = await lastValueFrom(this.kubeVirtService.scalePool(resizeNamespace, resizeName, cores, threads, sockets, memory));
                this.hideComponent("modal-resize");
                this.reloadComponent();
            } catch (e: any) {
                alert(e.error.message);
                 console.log(e);
            }
        }
    }

    /*
     * Show Priority Class Window
     */
    async showPc(): Promise<void> {
        let modalDiv = document.getElementById("modal-pc");
        let selectorPcFiled = document.getElementById("changepool-pc");
        let pcSelectorOptions = "";
        let data = await lastValueFrom(this.k8sApisService.getPriorityClasses());
        for (let i = 0; i < data.items.length; i++) {
            pcSelectorOptions += "<option value=" + data.items[i].metadata["name"] +">" + data.items[i].metadata["name"] + "</option>\n";
        }
        if (selectorPcFiled != null) {
            selectorPcFiled.innerHTML = pcSelectorOptions;
        }
        if(modalDiv != null) {
            modalDiv.setAttribute("class", "modal fade show");
            modalDiv.setAttribute("aria-modal", "true");
            modalDiv.setAttribute("role", "dialog");
            modalDiv.setAttribute("aria-hidden", "false");
            modalDiv.setAttribute("style","display: block;");
        }
    }

    /*
     * Change Pool Priority Class
     */
    async applyPc(poolNamespace: string, poolName: string, poolPc: string): Promise<void> {
        try {
            const data = await lastValueFrom(this.kubeVirtService.changePoolPc(poolNamespace, poolName, poolPc));
            this.hideComponent("modal-pc");
            this.reloadComponent();
        } catch (e: any) {
            alert(e.error.message);
            console.log(e);
        }
    }

    /*
     * Show Liveness
     */
    async showLiveness(): Promise<void> {
        let modalDiv = document.getElementById("modal-liveness");
        if(modalDiv != null) {
            modalDiv.setAttribute("class", "modal fade show");
            modalDiv.setAttribute("aria-modal", "true");
            modalDiv.setAttribute("role", "dialog");
            modalDiv.setAttribute("aria-hidden", "false");
            modalDiv.setAttribute("style","display: block;");
        }
    }

    /*
     * Liveness: Enable/Disable Health Check
     */
    async onChangeLiveness(status: string) {
        let hcType = document.getElementById("pooldetails-liveness-type");
        let hcPort = document.getElementById("pooldetails-liveness-port");
        let hcPath = document.getElementById("pooldetails-liveness-path");
        let hcDelay = document.getElementById("pooldetails-liveness-initialdelay");
        let hcInterval = document.getElementById("pooldetails-liveness-interval");
        let hcTimeout = document.getElementById("pooldetails-liveness-timeout");
        let hcFailure = document.getElementById("pooldetails-liveness-failure");
        let hcSuccess = document.getElementById("pooldetails-liveness-success");
        
        if ( hcType != null && hcPort != null && hcPath != null && hcDelay != null && hcInterval != null && 
             hcTimeout != null && hcFailure != null && hcSuccess != null ) {
            if(status.toLowerCase() == "enabled") {
                hcType.removeAttribute("disabled");
                hcPort.removeAttribute("disabled");
                hcPath.removeAttribute("disabled");
                hcDelay.removeAttribute("disabled");
                hcInterval.removeAttribute("disabled");
                hcTimeout.removeAttribute("disabled");
                hcFailure.removeAttribute("disabled");
                hcSuccess.removeAttribute("disabled");
            } else {
                hcType.setAttribute("disabled", "disabled");
                hcPort.setAttribute("disabled", "disabled");
                hcPath.setAttribute("disabled", "disabled");
                hcDelay.setAttribute("disabled", "disabled");
                hcInterval.setAttribute("disabled", "disabled");
                hcTimeout.setAttribute("disabled", "disabled");
                hcFailure.setAttribute("disabled", "disabled");
                hcSuccess.setAttribute("disabled", "disabled");
            }
        }
    }

    /*
     * Liveness: Change Health Check Type
     */
    async onChangeLivenessType(hcType: string) {
        let modalPath = document.getElementById("pooldetails-liveness-path-panel");
        if (modalPath != null) {
            if (hcType.toLowerCase() == "http") {
                modalPath.setAttribute("class", "modal fade show");
                modalPath.setAttribute("aria-modal", "true");
                modalPath.setAttribute("role", "dialog");
                modalPath.setAttribute("aria-hidden", "false");
                modalPath.setAttribute("style","display: contents;");
            } else {
                modalPath.setAttribute("class", "modal fade");
                modalPath.setAttribute("aria-modal", "false");
                modalPath.setAttribute("role", "");
                modalPath.setAttribute("aria-hidden", "true");
                modalPath.setAttribute("style","display: none;");
            }
        }
    }

    /*
     * Apply Liveness Probe Changes
     */
    async applyLiveness(namespace: string, name: string, enable: string): Promise<void> {
        this.inputLivenessSuccess = Number(1);
        if(enable.toLowerCase() == "disabled") {
            try {
                const data = await lastValueFrom(this.kubeVirtService.removePoolLiveness(namespace, name));
                this.hideComponent("modal-liveness");
                this.reloadComponent();
            } catch (e: any) {
                alert(e.error.message);
                console.log(e);
            }
        } else {
            if(this.selectedLivenessType.toLowerCase() == "http") {
                let myHttpProbe = new Probe().httpProbe;
                myHttpProbe.initialDelaySeconds = Number(this.inputLivenessDelay);
                myHttpProbe.periodSeconds  = Number(this.inputLivenessInterval);
                myHttpProbe.timeoutSeconds = Number(this.inputLivenessTimeout);
                myHttpProbe.failureThreshold = Number(this.inputLivenessFailure);
                myHttpProbe.successThreshold = Number(this.inputLivenessSuccess);
                myHttpProbe.httpGet.path = this.inputLivenessPath;
                myHttpProbe.httpGet.port = Number(this.inputLivenessPort);
                this.myVmPoolLivenessProbe = myHttpProbe;
            } else {
                let myTcpProbe = new Probe().tcpProbe;
                myTcpProbe.initialDelaySeconds = Number(this.inputLivenessDelay);
                myTcpProbe.periodSeconds  = Number(this.inputLivenessInterval);
                myTcpProbe.timeoutSeconds = Number(this.inputLivenessTimeout);
                myTcpProbe.failureThreshold = Number(this.inputLivenessFailure);
                myTcpProbe.successThreshold = Number(this.inputLivenessSuccess);
                myTcpProbe.tcpSocket.port = Number(this.inputLivenessPort);
                this.myVmPoolLivenessProbe = myTcpProbe;
            }
            try {
                if(this.activePool.hasLiveness) {
                    const removedata = await lastValueFrom(this.kubeVirtService.removePoolLiveness(namespace, name));
                }
                const data = await lastValueFrom(this.kubeVirtService.updatePoolLiveness(namespace, name, JSON.stringify(this.myVmPoolLivenessProbe)));
                this.hideComponent("modal-liveness");
                this.reloadComponent();
            } catch (e: any) {
                alert(e.error.message);
                console.log(e);
            }
        }
    }

    /*
     * Show Readiness
     */
    async showReadiness(): Promise<void> {
        let modalDiv = document.getElementById("modal-readiness");
        if(modalDiv != null) {
            modalDiv.setAttribute("class", "modal fade show");
            modalDiv.setAttribute("aria-modal", "true");
            modalDiv.setAttribute("role", "dialog");
            modalDiv.setAttribute("aria-hidden", "false");
            modalDiv.setAttribute("style","display: block;");
        }
    }

    /*
     * Readiness: Enable/Disable Health Check
     */
    async onChangeReadiness(status: string) {
        let hcType = document.getElementById("pooldetails-readiness-type");
        let hcPort = document.getElementById("pooldetails-readiness-port");
        let hcPath = document.getElementById("pooldetails-readiness-path");
        let hcDelay = document.getElementById("pooldetails-readiness-initialdelay");
        let hcInterval = document.getElementById("pooldetails-readiness-interval");
        let hcTimeout = document.getElementById("pooldetails-readiness-timeout");
        let hcFailure = document.getElementById("pooldetails-readiness-failure");
        let hcSuccess = document.getElementById("pooldetails-readiness-success");
        
        if ( hcType != null && hcPort != null && hcPath != null && hcDelay != null && hcInterval != null && 
             hcTimeout != null && hcFailure != null && hcSuccess != null ) {
            if(status.toLowerCase() == "enabled") {
                hcType.removeAttribute("disabled");
                hcPort.removeAttribute("disabled");
                hcPath.removeAttribute("disabled");
                hcDelay.removeAttribute("disabled");
                hcInterval.removeAttribute("disabled");
                hcTimeout.removeAttribute("disabled");
                hcFailure.removeAttribute("disabled");
                hcSuccess.removeAttribute("disabled");
            } else {
                hcType.setAttribute("disabled", "disabled");
                hcPort.setAttribute("disabled", "disabled");
                hcPath.setAttribute("disabled", "disabled");
                hcDelay.setAttribute("disabled", "disabled");
                hcInterval.setAttribute("disabled", "disabled");
                hcTimeout.setAttribute("disabled", "disabled");
                hcFailure.setAttribute("disabled", "disabled");
                hcSuccess.setAttribute("disabled", "disabled");
            }
        }
    }

    /*
     * Readiness: Change Health Check Type
     */
    async onChangeReadinessType(hcType: string) {
        let modalPath = document.getElementById("pooldetails-readiness-path-panel");
        if (modalPath != null) {
            if (hcType.toLowerCase() == "http") {
                modalPath.setAttribute("class", "modal fade show");
                modalPath.setAttribute("aria-modal", "true");
                modalPath.setAttribute("role", "dialog");
                modalPath.setAttribute("aria-hidden", "false");
                modalPath.setAttribute("style","display: contents;");
            } else {
                modalPath.setAttribute("class", "modal fade");
                modalPath.setAttribute("aria-modal", "false");
                modalPath.setAttribute("role", "");
                modalPath.setAttribute("aria-hidden", "true");
                modalPath.setAttribute("style","display: none;");
            }
        }
    }

    /*
     * Apply Readiness Probe Changes
     */
    async applyReadiness(namespace: string, name: string, enable: string): Promise<void> {
        this.inputReadinessSuccess = Number(1);
        if(enable.toLowerCase() == "disabled") {
            try {
                const data = await lastValueFrom(this.kubeVirtService.removePoolReadiness(namespace, name));
                this.hideComponent("modal-readiness");
                this.reloadComponent();
            } catch (e: any) {
                alert(e.error.message);
                console.log(e);
            }
        } else {
            if(this.selectedReadinessType.toLowerCase() == "http") {
                let myHttpProbe = new Probe().httpProbe;
                myHttpProbe.initialDelaySeconds = Number(this.inputReadinessDelay);
                myHttpProbe.periodSeconds  = Number(this.inputReadinessInterval);
                myHttpProbe.timeoutSeconds = Number(this.inputReadinessTimeout);
                myHttpProbe.failureThreshold = Number(this.inputReadinessFailure);
                myHttpProbe.successThreshold = Number(this.inputReadinessSuccess);
                myHttpProbe.httpGet.path = this.inputReadinessPath;
                myHttpProbe.httpGet.port = Number(this.inputReadinessPort);
                this.myVmPoolReadinessProbe = myHttpProbe;
            } else {
                let myTcpProbe = new Probe().tcpProbe;
                myTcpProbe.initialDelaySeconds = Number(this.inputReadinessDelay);
                myTcpProbe.periodSeconds  = Number(this.inputReadinessInterval);
                myTcpProbe.timeoutSeconds = Number(this.inputReadinessTimeout);
                myTcpProbe.failureThreshold = Number(this.inputReadinessFailure);
                myTcpProbe.successThreshold = Number(this.inputReadinessSuccess);
                myTcpProbe.tcpSocket.port = Number(this.inputReadinessPort);
                this.myVmPoolReadinessProbe = myTcpProbe;
            }
            try {
                if(this.activePool.hasReadiness) {
                    const removedata = await lastValueFrom(this.kubeVirtService.removePoolReadiness(namespace, name));
                }
                const data = await lastValueFrom(this.kubeVirtService.updatePoolReadiness(namespace, name, JSON.stringify(this.myVmPoolReadinessProbe)));
                this.hideComponent("modal-readiness");
                this.reloadComponent();
            } catch (e: any) {
                alert(e.error.message);
                console.log(e);
            }
        }
    }

    /*
     * VM Basic Operations (start, stop, etc...)
     */
    async vmOperations(vmOperation: string, vmNamespace: string, vmName: string): Promise<void> {
        if(vmOperation == "start"){
            var data = await lastValueFrom(this.kubeVirtService.startVm(vmNamespace, vmName));
            this.reloadComponent();
        } else if (vmOperation == "stop") {
            var data = await lastValueFrom(this.kubeVirtService.stopVm(vmNamespace, vmName));
            this.reloadComponent();
        } else if (vmOperation == "reboot"){
            var data = await lastValueFrom(this.kubeVirtService.restartVm(vmNamespace, vmName));
            this.reloadComponent();
        } else if (vmOperation == "delete") {
            const data = await lastValueFrom(this.kubeVirtService.deleteVm(vmNamespace, vmName));
            this.reloadComponent();
        }
    }

    /*
     * Open NoVNC
     */
    openNoVNC(namespace: string, name: string): void {
        let url = "/assets/noVNC/vnc.html?resize=scale&autoconnect=1&path=";
        let path = "/k8s/apis/subresources.kubevirt.io/v1alpha3/namespaces/" + namespace + "/virtualmachineinstances/" + name + "/vnc";
        let fullpath = url + path;
        window.open(fullpath, "kubevirt-manager.io: CONSOLE", "width=800,height=600,location=no,toolbar=no,menubar=no,resizable=yes");
    }

    /*
     * Reload this component
     */
    reloadComponent(): void {
        this.router.navigateByUrl('/refresh',{skipLocationChange:true}).then(()=>{
            this.router.navigate([`/vmpooldetail/${this.poolNamespace}/${this.poolName}`]);
        })
    }

}
