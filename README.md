# 서버통합플랫폼 포털

## REQUIREMENTS

These are the **minimum** requirements to have the system running.

Kubevirt featureGate `ExpandDisks` is **required**.

`CDI` is **required** with featureGate `HonorWaitForFirstConsumer` active:

```
  config:
    featureGates:
    - HonorWaitForFirstConsumer

```

StorageClass feature `allowVolumeExpansion` is **required**:

```
allowVolumeExpansion: true

```

If you are using hostpath-provisioner or any other local node storage, you will need to use `WaitForFirstConsumer`:

```
volumeBindingMode: WaitForFirstConsumer

```

*Note: These settings are required to work with a hostpath csi driver, in order to prevent virtual machine instances from being started in a node different from the node in which the disk/volume resides.*

## HOW TO INSTALL IT

### Create all WEB portal

```jsx
$ kubectl apply -f kubernetes/bundle.yaml
```

> **아래는 bundle.yaml 을 component별로 나눈 yaml들의 집합**
> 

### Create the Namespace

```
$ kubectl apply -f kubernetes/ns.yaml
```

### Create the Service Account and RBAC

```
$ kubectl apply -f kubernetes/rbac.yaml
```

### Create the FrontEnd Deployment

```
$ kubectl apply -f kubernetes/deployment.yaml
```

### Create the Priority Classes

```
$ kubectl apply -f kubernetes/pc.yaml
```

### Create the FrontEnd Service

```
kubectl apply -f kubernetes/service.yaml
```

## NGINX AUTHENTICATION (웹페이지 접근제어/아이디,비밀번호 설정)

To add `nginx` with `basic-auth`, you need to edit `kubernetes/auth_secret.yaml` and add your htpasswd file contents in base64 to the secret. The provided example has a single entry which username is `admin` and password is `admin`. You are encouraged to create your own file and replace in the secret.

An example of how to get the base64 of your file is:

```
$ cat htpasswd-file | base64 -w0
```

After adjusting secret contents, apply the configmap and the secret:

```
$ kubectl apply -f kubernetes/auth-config.yaml
$ kubectl apply -f kubernetes/auth-secret.yaml
```

You will need to restart (delete) the `Pod` or redeploy the solution for the changes to take effect.

*Note:* If you had previous versions of Prometheus integration make sure `proxy_set_header Authorization "";` is present on your Prometheus `ConfigMap`. You may use `kubernetes/prometheus-config.yaml` as a reference to make sure your `ConfigMap` looks ok.

*Note:* You may also want to check [htpasswd](https://httpd.apache.org/docs/2.4/programs/htpasswd.html) documentation for extra help on creating and managing the file.

## HOW TO USE IT

The recommended way to use this tool is through an `Ingress` or a `Service`.

You can also use `kubectl port-forward` on port 8080.

*Note:* As the tool needs Websocket support, if you are using an `Ingress` make sure you set it up accordingly.

## Building

To build the tool simply run:

```
docker build -t your-repo/kubevirt-manager:version .

**##dockerhub 사용시 아래와 같이 push###** 
docker push your-repo/kubevirt-manager:version

##ctr 명령어를 통한 image 사용법##
ctr --namespace=k8s.io image import {이미지압축파일명}
```

## Building & Running Locally(로컬에서 컴파일 및 디버깅)

Please clone noVNC:

```
cd src/assets/
git clone https://github.com/novnc/noVNC.git
```

To build the tool run:

```
npm install
ng build
```

To run the tool: (아래와 같이 proxy 세팅)

```
kubectl proxy --www=./dist/kubevirtmgr-webui/ --accept-hosts=^.*$ --address=[::] --api-prefix=/k8s/ --www-prefix=
```

Access the tool at: http://localhost:8001/

*Note:* Make sure your `kubectl` is pointing to the right cluster.

*Note:* Make sure the account your `kubectl` is using has correct RBAC.

*Note:* This method doesn't like `websocket` VNC.

*Note:* This method doesn't support `Prometheus` integration.

*Note:* This method doesn't support `NGINX basic_auth`.

## Testing

The tests implemented are pretty simple so far. To run the tests, simply execure:

```
npm test

**###또는###**
 
npm run watch **##디버깅시 활용##**
```

## License

**kubevirt-manager.io** is licensed under the [Apache Licence, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0.html).

## 페이지 추가 제작  리스트

### 1. snapshot

웹페이지소스코드 폴더 경로: ../src/app/snapshot/

API 소스코드 경로: ../src/app/services/k8s.service.ts

Parsing model 경로: ../src/app/models/kube-virt-vm.model.ts

### 2. log

웹페이지소스코드 폴더 경로: ../src/app/log/

API 소스코드 경로: ../src/app/services/k8s.service.ts

Parsing model 경로: ../src/app/services/k8s.service.ts (1차 파싱) , ../src/app/log/log.component.ts(2차 파싱)

### 3. active/standby VM 표기

웹페이지소스코드 폴더 경로: ../src/app/vmlist/

웹페이지소스코드 폴더 경로: ../src/app/snapshot/

VM 이름 Parsing model 경로: ../src/app/services/k8s.service.ts

## 페이지 코드 수정 리스트

### 1. main-footer

웹페이지소스코드 폴더 경로: ../src/app/main-footer/

- main-footer.component.html 일부 주석 처리

### 2. main-header

웹페이지소스코드 폴더 경로: ../src/app/main-header/

- main-header.component.html 일부 주석 처리

### 3. VM 제어 기능 아이콘

웹페이지소스코드 폴더 경로: ../src/app/vmlist/

- vmlist.component.html 일부 주석 처리

## 웹서버 Conf설정

경로: ../conf/default.conf

- Proxy path 설정
- 인가된 IP 대역 접근 권한 허용 설정
