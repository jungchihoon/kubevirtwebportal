import { KubeVirtVMI } from "./kube-virt-vmi.model";
import { SnapshotLIST } from "./snapshotlist.model";

export class KubeVirtVM {
  name:               string  = "";
  namespace:          string  = "";
  labels:                 {}  = {};
  creationTimestamp:   Date   = new Date;
  running:           boolean  = false;
  ready:             boolean  = false;
  status:             string  = "";
  cores:              number  = 0;
  sockets:            number  = 0;
  threads:            number  = 0;
  memory:             string  = "";
  nodeSel:            string  = "";
  instType:           string  = "";
  actstb:             string  = "";
  vmi:           KubeVirtVMI  = new KubeVirtVMI;
  priorityClass:      string  = "";
  printableStatus:    string  = "";
  snapshot:           SnapshotLIST[] = [new SnapshotLIST];
}
