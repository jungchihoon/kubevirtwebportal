import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SnapshotService {

    constructor(private http: HttpClient) { }

    /////////
    //치훈 Work
    //스냅샷 리스트를 가져오는 API///
    getVMsnapshot(): Observable<any> {
        var baseUrl ='./k8s/apis/snapshot.kubevirt.io/v1alpha1';
        return this.http.get(`${baseUrl}/vmsnapshots`);
    }
    
    //스냅샷 생성 API//
    createSnapshot(namespace: string, name: string, vmvalue: Object): Observable<any> {
        var baseUrl ='./k8s/apis/snapshot.kubevirt.io/v1alpha1';
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/vmsnapshots/${name}`, vmvalue, { 'headers': headers } );
    }
    //스냅샷 삭제 API///
    deleteSnapshot(namespace: string, name: string): Observable<any> {
        var baseUrl ='./k8s/apis/snapshot.kubevirt.io/v1alpha1';
        return this.http.delete(`${baseUrl}/namespaces/${namespace}/vmsnapshots/${name}`);
    }

}

