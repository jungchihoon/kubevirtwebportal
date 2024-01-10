import { Component, OnInit } from '@angular/core';
import { K8sService } from 'src/app/services/k8s.service';
import { K8sNode } from 'src/app/models/k8s-node.model';
import { lastValueFrom } from 'rxjs';

@Component({
selector: 'app-nodelist',
templateUrl: './log.component.html',
styleUrls: ['./log.component.css']
})

export class LogComponent implements OnInit {

	nodeList: K8sNode[] = []
	nodelogs: string = '';
	constructor(
		private k8sService: K8sService
	) { }

	async ngOnInit(): Promise<void> {
		await this.getNodes();
		let navTitle = document.getElementById("nav-title");
		if(navTitle != null) {
			navTitle.replaceChildren("로그");
		//	this.k8sService.getLogs1().subscribe((data: string) => {this.logs = data;});
		}
	}

	/*
	 * Get Nodes from Kubernetes
	 */
	async getNodes(): Promise<void> {
		try {
			let currentNode = new K8sNode;
			const data = await lastValueFrom(this.k8sService.getNodes());
			let nodes = data.items;

			for (let i = 0; i < nodes.length; i++) {
				currentNode = new K8sNode();
				currentNode.name = nodes[i].metadata["name"];
				// EJ-START 
				/* 
				if (currentNode.name.includes("master")){}
				else {
					currentNode.arch = nodes[i].status.nodeInfo["architecture"];
					currentNode.cidr = nodes[i].spec["podCIDR"];
					currentNode.mem = this.convertSize(nodes[i].status.capacity["memory"]);
					currentNode.disk = this.convertSize(nodes[i].status.capacity["ephemeral-storage"]);
					currentNode.cpu = nodes[i].status.capacity["cpu"];
					currentNode.os = nodes[i].status.nodeInfo["operatingSystem"];
					currentNode.osimg = nodes[i].status.nodeInfo["osImage"];
					currentNode.kernel = nodes[i].status.nodeInfo["kernelVersion"];
					currentNode.criver = nodes[i].status.nodeInfo["containerRuntimeVersion"];
					currentNode.kubever = nodes[i].status.nodeInfo["kubeletVersion"];
					if (currentNode.name.includes("node1")) {	
						const log = await lastValueFrom(this.k8sService.getLogs1());
						const nwlog = await lastValueFrom(this.k8sService.getLogs1());
						currentNode.logs = log;
						currentNode.nwlogs = nwlog;
						console.log(currentNode.logs);
						this.nodeList.push(currentNode);
					}
					else if (currentNode.name.includes("node2")) {
						const log = await lastValueFrom(this.k8sService.getLogs2());
						const nwlog = await lastValueFrom(this.k8sService.getLogs2());

						currentNode.logs = log;
						currentNode.nwlogs = nwlog; 
						this.nodeList.push(currentNode);
					}

					else {
						this.nodeList.push(currentNode);
					}
				}
				console.log("data");
				*/
				if (currentNode.name.includes("node1")) {
					const log = await lastValueFrom(this.k8sService.getLogs1());     
					const nwlog = await lastValueFrom(this.k8sService.getNWLogs());
					currentNode.logs = log.split('\n').slice(-1000); 
					currentNode.nwlogs = nwlog.split('\n').slice(-1000);    
					this.nodeList.push(currentNode);  
				}
				if (currentNode.name.includes("node2")) { 
					const log = await lastValueFrom(this.k8sService.getLogs2());
					currentNode.logs = log.split('\n').slice(-1000);
					currentNode.nwlogs = [];
					this.nodeList.push(currentNode);
				}
				// EJ-END 
			}
		} catch (e: any) {
			console.log(e);
		}
	}

	/*
	 * Convert unit size
	 */
	convertSize(inputSize: string): string {
		inputSize = inputSize.replace('Ki','');
		var fileSize = Number.parseFloat(inputSize)/ (1024*1024);
		return (Math.round(fileSize * 100) / 100).toString() + " GB";
	}

}
