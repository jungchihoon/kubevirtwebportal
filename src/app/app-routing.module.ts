import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClusterInstanceTypeListComponent } from './components/cluster-instance-type-list/cluster-instance-type-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DiskListComponent } from './components/disk-list/disk-list.component';
import { LoadBalancersComponent } from './components/load-balancers/load-balancers.component';
import { NetworkListComponent } from './components/network-list/network-list.component';
import { NodelistComponent } from './components/nodelist/nodelist.component';
import { RefreshComponent } from './components/refresh/refresh.component';
import { VmlistComponent } from './components/vmlist/vmlist.component';
import { VMPoolsComponent } from './components/vmpools/vmpools.component';
import { AutoscaleComponent } from './components/autoscale/autoscale.component';
import { VmdetailsComponent } from './components/vmdetails/vmdetails.component';
import { VmpooldetailsComponent } from './components/vmpooldetails/vmpooldetails.component';
import { KClusterComponent } from './components/kcluster/kcluster.component';
import { KClusterDetailsComponent } from './components/kcluster-details/kcluster-details.component';
//치훈 work//
import { LogComponent } from './components/log/log.component';
import { SnapshotComponent } from './components/snapshot/snapshotvmlist.component';
const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'vmlist', component: VmlistComponent },
  { path: 'snapshotvmlist', component: SnapshotComponent },
  { path: 'log', component: LogComponent },
  { path: 'vmpools', component: VMPoolsComponent},
  { path: 'vmdetail/:namespace/:name', component: VmdetailsComponent},
  { path: 'vmpooldetail/:namespace/:name', component: VmpooldetailsComponent},
  { path: 'autoscale', component: AutoscaleComponent},
  { path: 'nodelist', component: NodelistComponent },
  { path: 'dsklist', component: DiskListComponent },
  { path: 'netlist', component: NetworkListComponent },
  { path: 'lblist', component: LoadBalancersComponent},
  { path: 'citlist', component: ClusterInstanceTypeListComponent},
  { path: 'refresh', component: RefreshComponent},
  { path: 'kcluster', component: KClusterComponent},
  { path: 'kclusterdetails/:namespace/:name', component: KClusterDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
