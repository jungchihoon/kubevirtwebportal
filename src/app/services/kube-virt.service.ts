import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class KubeVirtService {

    constructor(private http: HttpClient) { }

    getVMs(): Observable<any> {
        var baseUrl ='./k8s/apis/kubevirt.io/v1alpha3';
        return this.http.get(`${baseUrl}/virtualmachines`);
    }

    getVM(namespace: string, name: string): Observable<any> {
        var baseUrl ='./k8s/apis/kubevirt.io/v1alpha3';
        return this.http.get(`${baseUrl}/namespaces/${namespace}/virtualmachines/${name}?labelSelector=kubevirt-manager.io%2Fmanaged`);
    }

    getVMsNamespaced(namespace: string): Observable<any> {
        var baseUrl ='./k8s/apis/kubevirt.io/v1alpha3';
        return this.http.get(`${baseUrl}/namespaces/${namespace}/virtualmachines?labelSelector=kubevirt-manager.io%2Fmanaged`);
    }

    getPooledVM(namespace: string, pool: string): Observable<any> {
        var baseUrl ='./k8s/apis/kubevirt.io/v1alpha3';
        return this.http.get(`${baseUrl}/namespaces/${namespace}/virtualmachines?labelSelector=kubevirt.io%2Fvmpool%3D${pool}&labelSelector=kubevirt-manager.io%2Fmanaged`);
    }

    getVMis(): Observable<any> {
        var baseUrl ='./k8s/apis/kubevirt.io/v1alpha3';
        return this.http.get(`${baseUrl}/virtualmachineinstances`);
    }

    getVMi(namespace: string, name: string): Observable<any> {
        var baseUrl ='./k8s/apis/kubevirt.io/v1alpha3';
        return this.http.get(`${baseUrl}/namespaces/${namespace}/virtualmachineinstances/${name}`);
    }

    getVMPools(): Observable<any> {
        var baseUrl ='./k8s/apis/pool.kubevirt.io/v1alpha1';
        return this.http.get(`${baseUrl}/virtualmachinepools?labelSelector=kubevirt.io%2Fvmpool&labelSelector=kubevirt-manager.io%2Fmanaged`);
    }

    getVMPoolsNamespaced(namespace: string): Observable<any> {
        var baseUrl ='./k8s/apis/pool.kubevirt.io/v1alpha1';
        return this.http.get(`${baseUrl}/namespaces/${namespace}/virtualmachinepools?labelSelector=kubevirt-manager.io%2Fmanaged`);
    }

    getVMPool(namespace: string, name: string): Observable<any> {
        var baseUrl ='./k8s/apis/pool.kubevirt.io/v1alpha1';
        return this.http.get(`${baseUrl}/namespaces/${namespace}/virtualmachinepools/${name}`);
    }

    startVm(namespace: string, name: string): Observable<any> {
        var baseUrl ='./k8s/apis/kubevirt.io/v1alpha3';
        const headers = {
            'content-type': 'application/merge-patch+json',
            'accept': 'application/json'
        };
        return this.http.patch(`${baseUrl}/namespaces/${namespace}/virtualmachines/${name}`, '{"spec":{"running": true}}', { 'headers': headers } );
    }

    powerOnVm(namespace: string, name: string): Observable<any> {
        return this.startVm(namespace, name);
    }

    stopVm(namespace: string, name: string): Observable<any> {
        var baseUrl ='./k8s/apis/kubevirt.io/v1alpha3';
        const headers = {
            'content-type': 'application/merge-patch+json',
            'accept': 'application/json'
        };
        return this.http.patch(`${baseUrl}/namespaces/${namespace}/virtualmachines/${name}`, '{"spec":{"running": false}}', { 'headers': headers } );
    }

    powerOffVm(namespace: string, name: string): Observable<any> {
        var baseUrl ='./k8s/apis/kubevirt.io/v1alpha3';
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        let body = '{"gracePeriodSeconds":0,"propagationPolicy":"Background"}';
        return this.http.delete(`${baseUrl}/namespaces/${namespace}/virtualmachineinstances/${name}`,  {'headers': headers, 'body': body});
    }

    restartVm(namespace: string, name: string): Observable<any> {
        var baseUrl ='./k8s/apis/subresources.kubevirt.io/v1';
        const headers = {
            'accept': 'application/json'
        };
        return this.http.put(`${baseUrl}/namespaces/${namespace}/virtualmachines/${name}/restart`, { 'headers': headers } );
    }

    pauseVm(namespace: string, name: string): Observable<any> {
        var baseUrl ='./k8s/apis/subresources.kubevirt.io/v1';
        const headers = {
            'accept': 'application/json'
        };
        return this.http.put(`${baseUrl}/namespaces/${namespace}/virtualmachineinstances/${name}/pause`, { 'headers': headers } );
    }

    unpauseVm(namespace: string, name: string): Observable<any> {
        var baseUrl ='./k8s/apis/subresources.kubevirt.io/v1';
        const headers = {
            'accept': 'application/json'
        };
        return this.http.put(`${baseUrl}/namespaces/${namespace}/virtualmachineinstances/${name}/unpause`, { 'headers': headers } );
    }

    scaleVm(namespace: string, name: string, cores: string, threads: string, sockets: string, memory: string): Observable<any> {
        var baseUrl ='./k8s/apis/kubevirt.io/v1alpha3';
        const headers = {
            'content-type': 'application/merge-patch+json',
            'accept': 'application/json'
        };
        return this.http.patch(`${baseUrl}/namespaces/${namespace}/virtualmachines/${name}`, '{"spec":{"template":{"spec":{"domain":{"cpu":{"sockets": '+sockets+',"cores": '+cores+',"threads": '+threads+'},"resources":{"requests":{"memory": "'+memory+'Gi"}}}}}}}', { 'headers': headers } );
    }

    changeVmType(namespace: string, name: string, type: string): Observable<any> {
        var baseUrl ='./k8s/apis/kubevirt.io/v1alpha3';
        const headers = {
            'content-type': 'application/merge-patch+json',
            'accept': 'application/json'
        };
        return this.http.patch(`${baseUrl}/namespaces/${namespace}/virtualmachines/${name}`, '{"spec":{"instancetype":{"name":"'+type+'"}}}', { 'headers': headers } );
    }

    changeVmPc(namespace: string, name: string, pc: string): Observable<any> {
        var baseUrl ='./k8s/apis/kubevirt.io/v1alpha3';
        const headers = {
            'content-type': 'application/merge-patch+json',
            'accept': 'application/json'
        };
        return this.http.patch(`${baseUrl}/namespaces/${namespace}/virtualmachines/${name}`, '{"spec":{"template":{"spce":{"priorityClassname":"'+pc+'"}}}}', { 'headers': headers } );
    }

    deleteVm(namespace: string, name: string): Observable<any> {
        var baseUrl ='./k8s/apis/kubevirt.io/v1alpha3';
        return this.http.delete(`${baseUrl}/namespaces/${namespace}/virtualmachines/${name}`);
    }

    createVm(namespace: string, name: string, vmvalue: Object): Observable<any> {
        var baseUrl ='./k8s/apis/kubevirt.io/v1alpha3';
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/virtualmachines/${name}`, vmvalue, { 'headers': headers } );
    }

    getClusterInstanceTypes(): Observable<any> {
        var baseUrl ='./k8s/apis/instancetype.kubevirt.io/v1alpha1';
        return this.http.get(`${baseUrl}/virtualmachineclusterinstancetypes`);
    }

    getClusterInstanceType(instType: string): Observable<any> {
        var baseUrl ='./k8s/apis/instancetype.kubevirt.io/v1alpha1';
        return this.http.get(`${baseUrl}/virtualmachineclusterinstancetypes/${instType}`);
    }

    deleteClusterInstanceType(typeName: string): Observable<any> {
        var baseUrl ='./k8s/apis/instancetype.kubevirt.io/v1alpha1';
        return this.http.delete(`${baseUrl}/virtualmachineclusterinstancetypes/${typeName}`);
    }

    createClusterInstanceType(typeName: string, typeValue: Object): Observable<any> {
        var baseUrl ='./k8s/apis/instancetype.kubevirt.io/v1alpha1';
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/virtualmachineclusterinstancetypes/${typeName}`, typeValue, { 'headers': headers } );
    }

    editClusterInstanceType(typeName: string, typeCPU: string, typeMemory: string): Observable<any> {
        var baseUrl ='./k8s/apis/instancetype.kubevirt.io/v1alpha1';
        const headers = {
            'content-type': 'application/merge-patch+json',
            'accept': 'application/json'
        };
        return this.http.patch(`${baseUrl}/virtualmachineclusterinstancetypes/${typeName}`, '{"spec":{"cpu":{"guest":' + typeCPU + '},"memory":{"guest":"' + typeMemory + 'Gi"}}}', { 'headers': headers } );
    }

    startPool(namespace: string, name: string): Observable<any> {
        var baseUrl ='./k8s/apis/pool.kubevirt.io/v1alpha1';
        const headers = {
            'content-type': 'application/merge-patch+json',
            'accept': 'application/json'
        };
        return this.http.patch(`${baseUrl}/namespaces/${namespace}/virtualmachinepools/${name}`, '{"spec":{"virtualMachineTemplate":{"spec":{"running": true}}}}', { 'headers': headers } );
    }

    stopPool(namespace: string, name: string): Observable<any> {
        var baseUrl ='./k8s/apis/pool.kubevirt.io/v1alpha1';
        const headers = {
            'content-type': 'application/merge-patch+json',
            'accept': 'application/json'
        };
        return this.http.patch(`${baseUrl}/namespaces/${namespace}/virtualmachinepools/${name}`, '{"spec":{"virtualMachineTemplate":{"spec":{"running": false}}}}', { 'headers': headers } );
    }

    deletePool(namespace: string, name: string): Observable<any> {
        var baseUrl ='./k8s/apis/pool.kubevirt.io/v1alpha1';
        return this.http.delete(`${baseUrl}/namespaces/${namespace}/virtualmachinepools/${name}`);
    }

    scalePoolReplicas(namespace: string, name: string, size: string): Observable<any> {
        var baseUrl ='./k8s/apis/pool.kubevirt.io/v1alpha1';
        const headers = {
            'content-type': 'application/merge-patch+json',
            'accept': 'application/json'
        };
        return this.http.patch(`${baseUrl}/namespaces/${namespace}/virtualmachinepools/${name}`, '{"spec":{"replicas": ' + size + '}}', { 'headers': headers } );
    }

    scalePool(namespace: string, name: string, cores: string, threads: string, sockets: string, memory: string): Observable<any> {
        var baseUrl ='./k8s/apis/pool.kubevirt.io/v1alpha1';
        const headers = {
            'content-type': 'application/merge-patch+json',
            'accept': 'application/json'
        };
        return this.http.patch(`${baseUrl}/namespaces/${namespace}/virtualmachinepools/${name}`, '{"spec":{"virtualMachineTemplate":{"spec":{"template":{"spec":{"domain":{"cpu":{"sockets": '+sockets+',"cores": '+cores+',"threads": '+threads+'},"resources":{"requests":{"memory": "'+memory+'Gi"}}}}}}}}}', { 'headers': headers } );
    }

    createPool(namespace: string, name: string, poolvalue: Object): Observable<any> {
        var baseUrl ='./k8s/apis/pool.kubevirt.io/v1alpha1';
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/virtualmachinepools/${name}`, poolvalue, { 'headers': headers } );
    }

    changePoolType(namespace: string, name: string, type: string): Observable<any> {
        var baseUrl ='./k8s/apis/pool.kubevirt.io/v1alpha1';
        const headers = {
            'content-type': 'application/merge-patch+json',
            'accept': 'application/json'
        };
        return this.http.patch(`${baseUrl}/namespaces/${namespace}/virtualmachinepools/${name}`, '{"spec":{"virtualMachineTemplate":{"spec":{"instancetype":{"name":"'+type+'"}}}}}', { 'headers': headers } );
    }

    changePoolPc(namespace: string, name: string, pc: string): Observable<any> {
        var baseUrl ='./k8s/apis/pool.kubevirt.io/v1alpha1';
        const headers = {
            'content-type': 'application/merge-patch+json',
            'accept': 'application/json'
        };
        return this.http.patch(`${baseUrl}/namespaces/${namespace}/virtualmachinepools/${name}`, '{"spec":{"virtualMachineTemplate":{"spec":{"template":{"spec":{"priorityClassName":"' + pc + '"}}}}}}', { 'headers': headers } );
    }

    removeVmFromPool(namespace: string, name: string, node: string): Observable<any> {
        var baseUrl ='./k8s/apis/kubevirt.io/v1alpha3';
        const headers = {
            'content-type': 'application/merge-patch+json',
            'accept': 'application/json'
        };
        return this.http.patch(`${baseUrl}/namespaces/${namespace}/virtualmachines/${name}`, '{"metadata":{"labels":{"kubevirt.io/domain":"'+ name +'","kubevirt.io/vm-pool-revision-name":null,"kubevirt.io/vmpool":null},"ownerReferences":null},"spec":{"template":{"spec": {"nodeSelector":{"kubernetes.io/hostname": "'+ node +'"}},"metadata":{"labels":{"kubevirt.io/domain":"'+ name +'","kubevirt.io/vm-pool-revision-name":null,"kubevirt.io/vmpool":null}}}}}', { 'headers': headers } );
    }

    removePoolLiveness(namespace: string, name: string): Observable<any> {
        var baseUrl ='./k8s/apis/pool.kubevirt.io/v1alpha1';
        const headers = {
            'content-type': 'application/merge-patch+json',
            'accept': 'application/json'
        };
        return this.http.patch(`${baseUrl}/namespaces/${namespace}/virtualmachinepools/${name}`, '{"spec":{"virtualMachineTemplate":{"spec":{"template":{"spec":{"livenessProbe":null}}}}}}', { 'headers': headers } );
    }

    updatePoolLiveness(namespace: string, name: string, liveness: string): Observable<any> {
        var baseUrl ='./k8s/apis/pool.kubevirt.io/v1alpha1';
        const headers = {
            'content-type': 'application/merge-patch+json',
            'accept': 'application/json'
        };
        return this.http.patch(`${baseUrl}/namespaces/${namespace}/virtualmachinepools/${name}`, '{"spec":{"virtualMachineTemplate":{"spec":{"template":{"spec":{"livenessProbe":'+ liveness +'}}}}}}', { 'headers': headers } );
    }

    removePoolReadiness(namespace: string, name: string): Observable<any> {
        var baseUrl ='./k8s/apis/pool.kubevirt.io/v1alpha1';
        const headers = {
            'content-type': 'application/merge-patch+json',
            'accept': 'application/json'
        };
        return this.http.patch(`${baseUrl}/namespaces/${namespace}/virtualmachinepools/${name}`, '{"spec":{"virtualMachineTemplate":{"spec":{"template":{"spec":{"readinessProbe":null}}}}}}', { 'headers': headers } );
    }

    updatePoolReadiness(namespace: string, name: string, readiness: string): Observable<any> {
        var baseUrl ='./k8s/apis/pool.kubevirt.io/v1alpha1';
        const headers = {
            'content-type': 'application/merge-patch+json',
            'accept': 'application/json'
        };
        return this.http.patch(`${baseUrl}/namespaces/${namespace}/virtualmachinepools/${name}`, '{"spec":{"virtualMachineTemplate":{"spec":{"template":{"spec":{"readinessProbe":'+ readiness +'}}}}}}', { 'headers': headers } );
    }

}
