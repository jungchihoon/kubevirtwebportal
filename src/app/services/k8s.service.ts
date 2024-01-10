import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl ='./k8s/api/v1'

const baseCont1URL = './cont1'  // EJ-ADD   
const baseCont2URL = './cont2'  // EJ-ADD   
const baseNWContURL = './nwcont'  // EJ-ADD   
const baseNWCont2URL = './nwcont2'  // EJ-ADD
@Injectable({
  providedIn: 'root'
})
export class K8sService {

    constructor(private http: HttpClient) { }
    
    //치훈 work
   getSnapshots(): Observable<any> {
        return this.http.get(`http://192.168.208.64:5000/list`);
    }
  
   getSnapshots1(name: string): Observable<any> {
	/*
        const baseUrl = 'http://10.104.184.51:5000/slist'
        const headers = {
          "User-Agent": "linux",  
          "Content-type": "application/json",
        };
	const jsonData = {"vm": `${name}`};
	console.log(jsonData);

        return this.http.post(baseUrl,jsonData, {headers: headers});
	console.log(this.http.post);
	*/
	// EJ-ADD 
	const headers = {
		"Content-type": "application/json",
	};
	const jsonData = {"vm": `${name}`};
	//console.log(jsonData);
	return this.http.post(`${baseCont1URL}/slist`, jsonData, {headers: headers});

    }

   getSnapshots2(name: string): Observable<any> {
	/* 
        const headers = {
            "User-Agent": "linux",
            'Content-Type': 'application/json',
        };
	const jsonData = {"vm": `${name}`};

        return this.http.post('http://10.99.38.185/slist', jsonData, {headers: headers});
	*/
	// EJ-ADD	
	const headers = {
		"Content-type": "application/json",
	};
	const jsonData = {"vm": `${name}`};
	//console.log(jsonData);
	return this.http.post(`${baseCont2URL}/slist`, jsonData, {headers: headers});
    }

    createSnapshot1(name: string): Observable<any> {
	/* 
        const headers = {
            "User-Agent": "linux",
            'Content-Type': 'application/json',
        };
        const jsonData = {"vm": `${name}`};

        return this.http.post('http://10.104.184.51:5000/create', jsonData, {headers: headers});
	*/
	// EJ-ADD
	const headers = {
		"Content-type": "application/json", 
	};
	const jsonData = {"vm": `${name}`};    
	return this.http.post(`${baseCont1URL}/create`, jsonData, {headers: headers});
    }
    createSnapshot2(name: string): Observable<any> {
	/* 
        const headers = {
            "User-Agent": "linux",
            'Content-Type': 'application/json',
        };
        const jsonData = {"vm": `${name}`};

        return this.http.post('http://10.99.38.185:5000/create', jsonData, {headers: headers});
	*/

	// EJ-ADD
	const headers = {
		"Content-type": "application/json", 
	};
	const jsonData = {"vm": `${name}`};    
	return this.http.post(`${baseCont2URL}/create`, jsonData, {headers: headers});

    }
    deleteSnapshot1(name: string): Observable<any> {
	/* 
        const headers = {
            "User-Agent": "linux",
            'Content-Type': 'application/json',
        };
        const jsonData = {"snapshot": `${name}`};

        return this.http.post('http://10.104.184.51:5000/delete', jsonData, {headers: headers});
	*/

	// EJ-ADD
	const headers = {
		"Content-type": "application/json", 
	};
        const jsonData = {"snapshot": `${name}`};
	return this.http.post(`${baseCont1URL}/delete`, jsonData, {headers: headers});
    }
    deleteSnapshot2(name: string): Observable<any> {
	/* 
        const headers = {
            "User-Agent": "linux",
            'Content-Type': 'application/json',
        };
        const jsonData = {"snapshot": `${name}`};

        return this.http.post('http://10.99.38.185:5000/delete', jsonData, {headers: headers});
	*/

	// EJ-ADD
	const headers = {
		"Content-type": "application/json", 
	};
        const jsonData = {"snapshot": `${name}`};
	return this.http.post(`${baseCont2URL}/delete`, jsonData, {headers: headers});
    }
   
   restoreSnapshot1(vmname: string, snapshotname: string): Observable<any> {
	/* 
        const headers = {
            "User-Agent": "linux",
            'Content-Type': 'application/json',
        };
        const jsonData = {"vm": `${vmname}`, "snapshot": `${snapshotname}`};

        return this.http.post('http://10.104.184.51:5000/restore', jsonData, {headers: headers});
	*/
	
	// EJ-ADD
	const headers = {
		"Content-type": "application/json", 
	};
        const jsonData = {"vm": `${vmname}`, "snapshot": `${snapshotname}`};
	return this.http.post(`${baseCont1URL}/restore`, jsonData, {headers: headers});

    }
    restoreSnapshot2(vmname: string, snapshotname: string): Observable<any> {
	/*
        const headers = {
            "User-Agent": "linux",
            'Content-Type': 'application/json',
        };
        const jsonData = {"vm": `${name}`};

        return this.http.post('http://10.99.38.185:5000/restore', jsonData, {headers: headers});
	*/

	// EJ-ADD
	const headers = {
		"Content-type": "application/json", 
	};
        const jsonData = {"vm": `${vmname}`, "snapshot": `${snapshotname}`};
	return this.http.post(`${baseCont2URL}/restore`, jsonData, {headers: headers});
    }
    
    getLogs1(): Observable<any> {
	/*
        return this.http.get(`http://10.104.184.51:5000/getlog`, {responseType: 'text'});
	*/

	// EJ-ADD
	return this.http.get(`${baseCont1URL}/getlog`, {responseType: 'text'});
    }

    getLogs2(): Observable<any> {
	/* 
        return this.http.get(`http://10.99.38.185:5000/getlog`, {responseType: 'text'});
	*/
	// EJ-ADD
	return this.http.get(`${baseCont2URL}/getlog`, {responseType: 'text'});
    }

    getNWLogs(): Observable<any> { // EJ-ADD
	return this.http.get(`${baseNWContURL}`, {responseType: 'text'}); 
    }
    
    getActiveSW(): Observable<any> { 
        return this.http.get(`${baseNWCont2URL}`, {responseType: 'text'});
    }
    getNodes(): Observable<any> {
        return this.http.get(`${baseUrl}/nodes`);
    }

    getNamespaces(): Observable<any> {
        return this.http.get(`${baseUrl}/namespaces`);
    }

    getNodeInfo(nodeName: string): Observable<any> {
        return this.http.get(`${baseUrl}/nodes/${nodeName}`);
    }

    getPersistentVolumes(): Observable<any> {
        return this.http.get(`${baseUrl}/persistentvolumes`);      
    }

    getPersistentVolumeInfo(volume: string): Observable<any> {
        return this.http.get(`${baseUrl}/persistentvolumes/${volume}`);      
    }

    deletePersistentVolume(volume: string): Observable<any> {
        return this.http.delete(`${baseUrl}/persistentvolumes/${volume}`);      
    }

    getPersistentVolumeClaims(): Observable<any> {
        return this.http.get(`${baseUrl}/persistentvolumeclaims`);
    }

    getNamespacedPersistentVolumeClaims(namespace: string): Observable<any> {
        return this.http.get(`${baseUrl}/namespaces/${namespace}/persistentvolumeclaims`);
    }

    getPersistentVolumeClaimsInfo(namespace: string, name: string): Observable<any> {
        return this.http.get(`${baseUrl}/namespaces/${namespace}/persistentvolumeclaims/${name}`);
    }

    deletePersistentVolumeClaims(namespace: string, name: string): Observable<any> {
        return this.http.delete(`${baseUrl}/namespaces/${namespace}/persistentvolumeclaims/${name}`);
    }

    resizePersistentVolumeClaims(namespace: string, name: string, size: string): Observable<any> {
        const headers = {
            'content-type': 'application/merge-patch+json',
            'accept': 'application/json'
        };
        return this.http.patch(`${baseUrl}/namespaces/${namespace}/persistentvolumeclaims/${name}`, '{"spec":{"resources":{"requests":{"storage":" '+size+'"}}}}', { 'headers': headers } );
    }

    createService(namespace: string, servicespec: Object): Observable<any> {
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/services`, servicespec, { 'headers': headers } );
    }

    getServices(): Observable<any> {
        return this.http.get(`${baseUrl}/services?labelSelector=kubevirt-manager.io%2Fmanaged`);
    }

    getServicesNamespaced(namespace: string): Observable<any> {
        return this.http.get(`${baseUrl}/namespaces/${namespace}/services?labelSelector=kubevirt-manager.io%2Fmanaged`);
    }

    getService(namespace: string, name: string): Observable<any> {
        return this.http.get(`${baseUrl}/namespaces/${namespace}/services/${name}`);
    }

    deleteService(namespace: string, name: string): Observable<any> {
        return this.http.delete(`${baseUrl}/namespaces/${namespace}/services/${name}`);
    }

    changeServiceType(namespace: string, name: string, type: string): Observable<any> {
        const headers = {
            'content-type': 'application/merge-patch+json',
            'accept': 'application/json'
        };
        return this.http.patch(`${baseUrl}/namespaces/${namespace}/services/${name}`, '{"spec":{"type":"'+type+'"}}', { 'headers': headers } );
    }


}
