import{_ as p,M as i,p as o,q as l,R as n,t as s,N as e,a1 as t}from"./framework-449724a9.js";const c="/assets/devops-roles-07544c66.jpg",u="/assets/devops-waterfall-7409451d.jpg",r="/assets/devops-agile-79322a4d.jpg",d="/assets/devops-compire-c8c78ece.jpg",k="/assets/devops-tools-2951da38.jpg",v="/assets/jenkins_setup-bb028941.jpg",m="/assets/jenkins-mainpage-4e821e1f.jpg",b="/assets/jenkins-install-plugins-76b3a0f6.jpg",g="/assets/jenkins-gitlab-c29ecafa.png",h="/assets/gitlab-connection-76f1ca32.jpg",q="/assets/gitlab-webhook-success-f7e0d1ba.jpg",y="/assets/jenkins-new-node-82ad754c.jpg",_="/assets/slave-tunnel-508f10d2.jpg",f="/assets/jenkins-node-lists-ddbf8099.jpg",w="/assets/pipeline-factory-753016ae.jpeg",S="/assets/realworld-pipeline-flow-4da6d81a.png",T="/assets/gitlab-cicd-7989fdec.jpg",A="/assets/gitlab-merge-request-a691c1a8.jpg",j="/assets/gitlab-no-docker-err-4cac3115.png",E="/assets/pod-template-jnlp-d4d73e5d.jpg",I="/assets/jenkins-docker-sock-a071a25e.png",x="/assets/sonarqube-85321c07.webp",C={},R=t('<h1 id="_14-05-docker-k8s教程-05从零开始构建基于kubernetes的devops平台" tabindex="-1"><a class="header-anchor" href="#_14-05-docker-k8s教程-05从零开始构建基于kubernetes的devops平台" aria-hidden="true">#</a> 14-05_Docker+k8s教程-05从零开始构建基于Kubernetes的DevOps平台</h1><h3 id="基于kubernetes的devops平台实践" tabindex="-1"><a class="header-anchor" href="#基于kubernetes的devops平台实践" aria-hidden="true">#</a> 基于Kubernetes的DevOps平台实践</h3><p>持续集成工具：</p><ul><li>Jenkins</li><li>gitlabci</li><li>Tekton</li></ul><p>本章基于k8s集群部署gitlab、sonarQube、Jenkins等工具，并把上述工具集成到Jenkins中，以Django项目和SpringBoot项目为例，通过多分支流水线及Jenkinsfile实现项目代码提交到不同的仓库分支，实现自动代码扫描、单元测试、docker容器构建、k8s服务的自动部署。</p><ul><li>DevOps、CI、CD介绍</li><li>Jenkins、sonarQube、gitlab的快速部署</li><li>Jenkins初体验</li><li>流水线入门及Jenkinsfile使用</li><li>Jenkins与Kubernetes的集成</li><li>sonarQube代码扫描与Jenkins的集成</li><li>实践Django项目的基于Jenkinsfile实现开发、测试环境的CI/CD</li></ul><h4 id="devops、ci、cd介绍" tabindex="-1"><a class="header-anchor" href="#devops、ci、cd介绍" aria-hidden="true">#</a> DevOps、CI、CD介绍</h4><p>Continuous Integration (<em>CI</em>) / Continuous Delivery (<em>CD</em>)</p><p>软件交付流程</p><p><img src="'+c+'" alt=""></p><p>一个软件从零开始到最终交付，大概包括以下几个阶段：规划、编码、构建、测试、发布、部署和维护，基于这些阶段，我们的软件交付模型大致经历了几个阶段：</p><h5 id="瀑布式流程" tabindex="-1"><a class="header-anchor" href="#瀑布式流程" aria-hidden="true">#</a> 瀑布式流程</h5><p><img src="'+u+'" alt=""></p><p>前期需求确立之后，软件开发人员花费数周和数月编写代码，把所有需求一次性开发完，然后将代码交给QA（质量保障）团队进行测试，然后将最终的发布版交给运维团队去部署。瀑布模型，简单来说，就是等一个阶段所有工作完成之后，再进入下一个阶段。这种模式的问题也很明显，产品迭代周期长，灵活性差。一个周期动辄几周几个月，适应不了当下产品需要快速迭代的场景。</p><h5 id="敏捷开发" tabindex="-1"><a class="header-anchor" href="#敏捷开发" aria-hidden="true">#</a> 敏捷开发</h5><p><img src="'+r+'" alt=""></p><p>任务由大拆小，开发、测试协同工作，注重开发敏捷，不重视交付敏捷</p><h5 id="devops" tabindex="-1"><a class="header-anchor" href="#devops" aria-hidden="true">#</a> DevOps</h5><p><img src="'+d+'" alt=""></p><p>开发、测试、运维协同工作, 持续开发+持续交付。</p><p>我们是否可以认为DevOps = 提倡开发、测试、运维协同工作来实现持续开发、持续交付的一种软件交付模式？</p><p>大家想一下为什么最初的开发模式没有直接进入DevOps的时代？</p><p>原因是：沟通成本。</p><p>各角色人员去沟通协作的时候都是手动去做，交流靠嘴，靠人去指挥，很显然会出大问题。所以说不能认为DevOps就是一种交付模式，因为解决不了沟通协作成本，这种模式就不具备可落地性。</p><p>那DevOps时代如何解决角色之间的成本问题？DevOps的核心就是自动化。自动化的能力靠什么来支撑，工具和技术。</p><p>DevOps工具链</p><p><img src="'+k+'" alt=""></p><p>靠这些工具和技术，才实现了自动化流程，进而解决了协作成本，使得devops具备了可落地性。因此我们可以大致给devops一个定义：</p><p>devops = 提倡开发、测试、运维协同工作来实现持续开发、持续交付的一种软件交付模式 + 基于工具和技术支撑的自动化流程的落地实践。</p><p>因此devops不是某一个具体的技术，而是一种思想+自动化能力，来使得构建、测试、发布软件能够更加地便捷、频繁和可靠的落地实践。本次课程核心内容就是要教会大家如何利用工具和技术来实现完整的DevOps平台的建设。我们主要使用的工具有：</p><ol><li>gitlab，代码仓库，企业内部使用最多的代码版本管理工具。</li><li>Jenkins， 一个可扩展的持续集成引擎，用于自动化各种任务，包括构建、测试和部署软件。</li><li>robotFramework， 基于Python的自动化测试框架</li><li>sonarqube，代码质量管理平台</li><li>maven，java包构建管理工具</li><li>Kubernetes</li><li>Docker</li></ol><h4 id="jenkins初体验" tabindex="-1"><a class="header-anchor" href="#jenkins初体验" aria-hidden="true">#</a> Jenkins初体验</h4><h5 id="kubernetes环境中部署jenkins" tabindex="-1"><a class="header-anchor" href="#kubernetes环境中部署jenkins" aria-hidden="true">#</a> Kubernetes环境中部署jenkins</h5>',33),M={href:"https://jenkins.io/zh/doc/book/installing/",target:"_blank",rel:"noopener noreferrer"},G=t(`<p>注意点：</p><ol><li>第一次启动很慢</li><li>因为后面Jenkins会与kubernetes集群进行集成，会需要调用kubernetes集群的api，因此安装的时候创建了ServiceAccount并赋予了cluster-admin的权限</li><li>默认部署到jenkins=true的节点</li><li>初始化容器来设置权限</li><li>ingress来外部访问</li><li>数据存储通过hostpath挂载到宿主机中</li></ol><p><code>jenkins/jenkins-all.yaml</code></p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Namespace
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> jenkins
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ServiceAccount
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> jenkins
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> jenkins
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> rbac.authorization.k8s.io/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ClusterRoleBinding
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> jenkins<span class="token punctuation">-</span>crb
<span class="token key atrule">roleRef</span><span class="token punctuation">:</span>
  <span class="token key atrule">apiGroup</span><span class="token punctuation">:</span> rbac.authorization.k8s.io
  <span class="token key atrule">kind</span><span class="token punctuation">:</span> ClusterRole
  <span class="token key atrule">name</span><span class="token punctuation">:</span> cluster<span class="token punctuation">-</span>admin
<span class="token key atrule">subjects</span><span class="token punctuation">:</span>
<span class="token punctuation">-</span> <span class="token key atrule">kind</span><span class="token punctuation">:</span> ServiceAccount
  <span class="token key atrule">name</span><span class="token punctuation">:</span> jenkins
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> jenkins
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> jenkins<span class="token punctuation">-</span>master
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> jenkins
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">1</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">devops</span><span class="token punctuation">:</span> jenkins<span class="token punctuation">-</span>master
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">labels</span><span class="token punctuation">:</span>
        <span class="token key atrule">devops</span><span class="token punctuation">:</span> jenkins<span class="token punctuation">-</span>master
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">nodeSelector</span><span class="token punctuation">:</span>
        <span class="token key atrule">jenkins</span><span class="token punctuation">:</span> <span class="token string">&quot;true&quot;</span>
      <span class="token key atrule">serviceAccount</span><span class="token punctuation">:</span> jenkins <span class="token comment">#Pod 需要使用的服务账号</span>
      <span class="token key atrule">initContainers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> fix<span class="token punctuation">-</span>permissions
        <span class="token key atrule">image</span><span class="token punctuation">:</span> busybox
        <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;sh&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;-c&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;chown -R 1000:1000 /var/jenkins_home&quot;</span><span class="token punctuation">]</span>
        <span class="token key atrule">securityContext</span><span class="token punctuation">:</span>
          <span class="token key atrule">privileged</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
        <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> jenkinshome
          <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /var/jenkins_home  
      <span class="token comment"># 解决jenkins安装插件，报 UnknownHostException 异常</span>
      <span class="token key atrule">dnsConfig</span><span class="token punctuation">:</span>
         <span class="token key atrule">options</span><span class="token punctuation">:</span>
          <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> ndots
            <span class="token key atrule">value</span><span class="token punctuation">:</span> <span class="token string">&quot;2&quot;</span>
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> jenkins
        <span class="token comment">#image: jenkinsci/blueocean:1.23.2</span>
        <span class="token key atrule">image</span><span class="token punctuation">:</span> 10.0.0.181<span class="token punctuation">:</span>5000/jenkinsci/blueocean<span class="token punctuation">:</span><span class="token number">2.394</span>
        <span class="token comment">#image: jenkins/jenkins:latest</span>
        <span class="token key atrule">image</span><span class="token punctuation">:</span> jenkinsci/blueocean<span class="token punctuation">:</span>latest
        <span class="token key atrule">imagePullPolicy</span><span class="token punctuation">:</span> IfNotPresent
        <span class="token key atrule">ports</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> http <span class="token comment">#Jenkins Master Web 服务端口</span>
          <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">8080</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> slavelistener <span class="token comment">#Jenkins Master 供未来 Slave 连接的端口</span>
          <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">50000</span>
        <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> jenkinshome
          <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /var/jenkins_home
        <span class="token key atrule">env</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> JAVA_OPTS
          <span class="token key atrule">value</span><span class="token punctuation">:</span> <span class="token string">&quot;-Xms4096m -Xmx5120m -Duser.timezone=Asia/Shanghai -Dhudson.model.DirectoryBrowserSupport.CSP=&quot;</span>
      <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> jenkinshome
        <span class="token key atrule">hostPath</span><span class="token punctuation">:</span>
          <span class="token key atrule">path</span><span class="token punctuation">:</span> /var/jenkins_home/
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> jenkins
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> jenkins
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> http
    <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">8080</span>
    <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">8080</span>
  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> slavelistener
    <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">50000</span>
    <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">50000</span>
  <span class="token key atrule">type</span><span class="token punctuation">:</span> ClusterIP
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">devops</span><span class="token punctuation">:</span> jenkins<span class="token punctuation">-</span>master
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> networking.k8s.io/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Ingress
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> jenkins<span class="token punctuation">-</span>web
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> jenkins
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">rules</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> jenkins.nohi.com
    <span class="token key atrule">http</span><span class="token punctuation">:</span>
      <span class="token key atrule">paths</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">path</span><span class="token punctuation">:</span> /
        <span class="token key atrule">pathType</span><span class="token punctuation">:</span> Prefix
        <span class="token key atrule">backend</span><span class="token punctuation">:</span>
          <span class="token key atrule">service</span><span class="token punctuation">:</span>
            <span class="token key atrule">name</span><span class="token punctuation">:</span> jenkins
            <span class="token key atrule">port</span><span class="token punctuation">:</span>
              <span class="token key atrule">number</span><span class="token punctuation">:</span> <span class="token number">8080</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>   # 解决jenkins安装插件，报 UnknownHostException 异常   
      dnsConfig:
         options:
          - name: ndots
            value: &quot;2&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>创建服务：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token comment">## 为k8s-worker1打标签，将jenkins-master部署在k8s-worker1节点</span>
$ kubectl label node k8s-worker1 jenkins=true
<span class="token comment">## 部署服务</span>
$ kubectl create <span class="token operator">-</span>f jenkins-all<span class="token punctuation">.</span>yaml
<span class="token comment">## 查看服务</span>
$ kubectl <span class="token operator">-</span>n jenkins get po
NAME                              READY   STATUS    RESTARTS   AGE
jenkins-master-767df9b574-lgdr5   1/1     Running   0          20s

<span class="token comment"># 查看日志，第一次启动提示需要完成初始化设置</span>
$ kubectl <span class="token operator">-</span>n jenkins logs <span class="token operator">-</span>f jenkins-master-767df9b574-lgdr5
<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
<span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span>

Jenkins initial setup is required<span class="token punctuation">.</span> An admin user has been created and a password generated<span class="token punctuation">.</span>
Please use the following password to proceed to installation:

5396b4e1c395450f8360efd8ee641b18

This may also be found at: <span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>jenkins_home/secrets/initialAdminPassword

<span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>访问服务：</p><p>配置hosts解析，<code>10.0.0.181 jenkins.nohi.com</code>，然后使用浏览器域名访问服务。第一次访问需要大概几分钟的初始化时间。</p><p><img src="`+v+`" alt=""></p><p>使用jenkins启动日志中的密码，或者执行下面的命令获取解锁的管理员密码：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ kubectl <span class="token operator">-</span>n jenkins exec jenkins-master-767df9b574-lgdr5 bash 
<span class="token operator">/</span> <span class="token comment"># cat /var/jenkins_home/secrets/initialAdminPassword</span>
35b083de1d25409eaef57255e0da481a

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>点击叉号，跳过选择安装推荐的插件环节，直接进入Jenkins。由于默认的插件地址安装非常慢，我们可以替换成国内清华的源，进入 jenkins 工作目录，目录下面有一个 <code>updates</code> 的目录，下面有一个 <code>default.json</code> 文件，我们执行下面的命令替换插件地址：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ cd <span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>jenkins_home/updates
$ sed <span class="token operator">-</span>i <span class="token string">&#39;s/https:\\/\\/updates.jenkins.io\\/download/https:\\/\\/mirrors.tuna.tsinghua.edu.cn\\/jenkins/g&#39;</span> default<span class="token punctuation">.</span>json 
$ sed <span class="token operator">-</span>i <span class="token string">&#39;s/http:\\/\\/www.google.com/https:\\/\\/www.baidu.com/g&#39;</span> default<span class="token punctuation">.</span>json
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>20230312 本次安装为 jenkinsci/blueocean:latest</p><p>在页面中配置update site: 在插件中心的高级选项中(jenkins-&gt;Manage Jenkins-&gt;Manage Plugins)，下拉升级站点，将原地址<code>https://updates.jenkins.io/update-center.json</code>改为<code>https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json</code>，然后点击保存</p></blockquote><blockquote><p>暂时先不用重新启动pod，汉化后一起重启。</p></blockquote><p>选择右上角admin-&gt;configure-&gt;password重新设置管理员密码，设置完后，会退出要求重新登录，使用admin/xxxxxx(新密码)，登录即可。</p><p><img src="`+m+'" alt=""></p><h5 id="安装汉化插件" tabindex="-1"><a class="header-anchor" href="#安装汉化插件" aria-hidden="true">#</a> 安装汉化插件</h5><p>Jenkins -&gt; manage Jenkins -&gt; Plugin Manager -&gt; Avaliable，搜索 <code>chinese</code>关键字</p><p><img src="'+b+`" alt=""></p><p>选中后，选择[Install without restart]，等待下载完成，然后点击[ Restart Jenkins when installation is complete and no jobs are running ]，让Jenkins自动重启</p><p>启动后，界面默认变成中文。</p><h5 id="jenkins基本使用演示" tabindex="-1"><a class="header-anchor" href="#jenkins基本使用演示" aria-hidden="true">#</a> Jenkins基本使用演示</h5><h6 id="演示目标" tabindex="-1"><a class="header-anchor" href="#演示目标" aria-hidden="true">#</a> 演示目标</h6><ul><li>代码提交gitlab，自动触发Jenkins任务</li><li>Jenkins任务完成后发送钉钉消息通知</li></ul><h6 id="演示准备" tabindex="-1"><a class="header-anchor" href="#演示准备" aria-hidden="true">#</a> 演示准备</h6><p><em>gitlab代码仓库搭建</em></p><p>https://github.com/sameersbn/docker-gitlab</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token comment">## 全量部署的组件</span>
$ gitlab-ctl status
run: alertmanager: <span class="token punctuation">(</span>pid 1987<span class="token punctuation">)</span> 27s<span class="token punctuation">;</span> run: log: <span class="token punctuation">(</span>pid 1986<span class="token punctuation">)</span> 27s
run: gitaly: <span class="token punctuation">(</span>pid 1950<span class="token punctuation">)</span> 28s<span class="token punctuation">;</span> run: log: <span class="token punctuation">(</span>pid 1949<span class="token punctuation">)</span> 28s
run: gitlab-exporter: <span class="token punctuation">(</span>pid 1985<span class="token punctuation">)</span> 27s<span class="token punctuation">;</span> run: log: <span class="token punctuation">(</span>pid 1984<span class="token punctuation">)</span> 27s
run: gitlab-workhorse: <span class="token punctuation">(</span>pid 1956<span class="token punctuation">)</span> 28s<span class="token punctuation">;</span> run: log: <span class="token punctuation">(</span>pid 1955<span class="token punctuation">)</span> 28s
run: logrotate: <span class="token punctuation">(</span>pid 1960<span class="token punctuation">)</span> 28s<span class="token punctuation">;</span> run: log: <span class="token punctuation">(</span>pid 1959<span class="token punctuation">)</span> 28s
run: nginx: <span class="token punctuation">(</span>pid 2439<span class="token punctuation">)</span> 1s<span class="token punctuation">;</span> run: log: <span class="token punctuation">(</span>pid 1990<span class="token punctuation">)</span> 27s
run: node-exporter: <span class="token punctuation">(</span>pid 1963<span class="token punctuation">)</span> 28s<span class="token punctuation">;</span> run: log: <span class="token punctuation">(</span>pid 1962<span class="token punctuation">)</span> 28s
run: postgres-exporter: <span class="token punctuation">(</span>pid 1989<span class="token punctuation">)</span> 27s<span class="token punctuation">;</span> run: log: <span class="token punctuation">(</span>pid 1988<span class="token punctuation">)</span> 27s
run: postgresql: <span class="token punctuation">(</span>pid 1945<span class="token punctuation">)</span> 28s<span class="token punctuation">;</span> run: log: <span class="token punctuation">(</span>pid 1944<span class="token punctuation">)</span> 28s
run: prometheus: <span class="token punctuation">(</span>pid 1973<span class="token punctuation">)</span> 28s<span class="token punctuation">;</span> run: log: <span class="token punctuation">(</span>pid 1972<span class="token punctuation">)</span> 28s
run: puma: <span class="token punctuation">(</span>pid 1968<span class="token punctuation">)</span> 28s<span class="token punctuation">;</span> run: log: <span class="token punctuation">(</span>pid 1966<span class="token punctuation">)</span> 28s
run: redis: <span class="token punctuation">(</span>pid 1952<span class="token punctuation">)</span> 28s<span class="token punctuation">;</span> run: log: <span class="token punctuation">(</span>pid 1951<span class="token punctuation">)</span> 28s
run: redis-exporter: <span class="token punctuation">(</span>pid 1971<span class="token punctuation">)</span> 28s<span class="token punctuation">;</span> run: log: <span class="token punctuation">(</span>pid 1964<span class="token punctuation">)</span> 28s
run: sidekiq: <span class="token punctuation">(</span>pid 1969<span class="token punctuation">)</span> 28s<span class="token punctuation">;</span> run: log: <span class="token punctuation">(</span>pid 1967<span class="token punctuation">)</span> 28s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>部署分析：</p><ol><li>依赖postgres</li><li>依赖redis</li></ol><p>使用k8s部署：</p><ol><li><p>准备secret文件</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ <span class="token function">cat</span> gitlab-secret<span class="token punctuation">.</span>txt
postgres<span class="token punctuation">.</span>user<span class="token punctuation">.</span>root=root
postgres<span class="token punctuation">.</span><span class="token function">pwd</span><span class="token punctuation">.</span>root=1qaz2wsx

$ kubectl <span class="token operator">-</span>n jenkins create secret generic gitlab-secret <span class="token operator">--</span><span class="token keyword">from</span><span class="token operator">-</span>env-file=gitlab-secret<span class="token punctuation">.</span>txt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>部署postgres</p><p>注意点：</p><ul><li>使用secret来引用账户密码</li><li>使用postgres=true来指定节点</li></ul><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ <span class="token function">cat</span> postgres<span class="token punctuation">.</span>yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres
  labels:
    app: postgres
  namespace: jenkins
spec:
  ports:
  <span class="token operator">-</span> name: server
    port: 5432
    targetPort: 5432
    protocol: TCP
  selector:
    app: postgres
<span class="token operator">--</span><span class="token operator">-</span>
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: jenkins
  name: postgres
  labels:
    app: postgres
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      nodeSelector:
        postgres: <span class="token string">&quot;true&quot;</span>
      tolerations:
      <span class="token operator">-</span> operator: <span class="token string">&quot;Exists&quot;</span>
      containers:
      <span class="token operator">-</span> name: postgres
        image:  postgres:11<span class="token punctuation">.</span>4 <span class="token comment">#若本地没有启动该仓库，换成postgres:11.4</span>
        imagePullPolicy: <span class="token string">&quot;IfNotPresent&quot;</span>
        ports:
        <span class="token operator">-</span> containerPort: 5432
        env:
        <span class="token operator">-</span> name: POSTGRES_USER           <span class="token comment">#PostgreSQL 用户名</span>
          valueFrom:
            secretKeyRef:
              name: gitlab-secret
              key: postgres<span class="token punctuation">.</span>user<span class="token punctuation">.</span>root
        <span class="token operator">-</span> name: POSTGRES_PASSWORD       <span class="token comment">#PostgreSQL 密码</span>
          valueFrom:
            secretKeyRef:
              name: gitlab-secret
              key: postgres<span class="token punctuation">.</span><span class="token function">pwd</span><span class="token punctuation">.</span>root
        resources:
          limits:
            cpu: 1000m
            memory: 2048Mi
          requests:
            cpu: 50m
            memory: 100Mi
        volumeMounts:
        <span class="token operator">-</span> mountPath: <span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>lib/postgresql/<span class="token keyword">data</span>
          name: postgredb
      volumes:
      <span class="token operator">-</span> name: postgredb
        hostPath:
          path: <span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>lib/postgres/
          

<span class="token comment">#部署到k8s-worker2节点</span>
$ kubectl label node k8s-worker2 postgres=true

<span class="token comment">#创建postgres</span>
$ kubectl create <span class="token operator">-</span>f postgres<span class="token punctuation">.</span>yaml

<span class="token comment"># 创建数据库gitlab,为后面部署gitlab组件使用</span>
$ kubectl <span class="token operator">-</span>n jenkins exec <span class="token operator">-</span>ti postgres-7ff9b49f4c-nt8zh bash
root@postgres-7ff9b49f4c-nt8zh:<span class="token operator">/</span><span class="token comment"># psql</span>
root=<span class="token comment"># create database gitlab;</span>
CREATE DATABASE
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>部署redis</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ <span class="token function">cat</span> redis<span class="token punctuation">.</span>yaml
apiVersion: v1
kind: Service
metadata:
  name: redis
  labels:
    app: redis
  namespace: jenkins
spec:
  ports:
  <span class="token operator">-</span> name: server
    port: 6379
    targetPort: 6379
    protocol: TCP
  selector:
    app: redis
<span class="token operator">--</span><span class="token operator">-</span>
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: jenkins
  name: redis
  labels:
    app: redis
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      tolerations:
      <span class="token operator">-</span> operator: <span class="token string">&quot;Exists&quot;</span>
      containers:
      <span class="token operator">-</span> name: redis
        image:  sameersbn/redis:4<span class="token punctuation">.</span>0<span class="token punctuation">.</span>9-2
        imagePullPolicy: <span class="token string">&quot;IfNotPresent&quot;</span>
        ports:
        <span class="token operator">-</span> containerPort: 6379
        resources:
          limits:
            cpu: 1000m
            memory: 2048Mi
          requests:
            cpu: 50m
            memory: 100Mi
            
<span class="token comment"># 创建</span>
$ kubectl create <span class="token operator">-</span>f redis<span class="token punctuation">.</span>yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>部署gitlab</p><p>注意点：</p><ul><li>使用ingress暴漏服务</li><li>添加annotation，指定nginx端上传大小限制，否则推送代码时会默认被限制1m大小，相当于给nginx设置client_max_body_size的限制大小</li><li>使用gitlab=true来选择节点</li><li>使用服务发现地址来访问postgres和redis</li><li>在secret中引用数据库账户和密码</li><li>数据库名称为gitlab</li></ul><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ <span class="token function">cat</span> gitlab<span class="token punctuation">.</span>yaml
apiVersion: networking<span class="token punctuation">.</span>k8s<span class="token punctuation">.</span>io/v1
kind: Ingress
metadata:
  name: gitlab
  namespace: jenkins
  annotations:
    nginx<span class="token punctuation">.</span>ingress<span class="token punctuation">.</span>kubernetes<span class="token punctuation">.</span>io/proxy-body-size: <span class="token string">&quot;50m&quot;</span>
spec:
  rules:
  <span class="token operator">-</span> host: gitlab<span class="token punctuation">.</span>nohi<span class="token punctuation">.</span>com
    http:
      paths:
      <span class="token operator">-</span> path: <span class="token operator">/</span>
        pathType: Prefix
        backend:
          service:
            name: gitlab
            port:
              number: 80
<span class="token operator">--</span><span class="token operator">-</span>
apiVersion: v1
kind: Service
metadata:
  name: gitlab
  labels:
    app: gitlab
  namespace: jenkins
spec:
  ports:
  <span class="token operator">-</span> name: server
    port: 80
    targetPort: 80
    protocol: TCP
  selector:
    app: gitlab
<span class="token operator">--</span><span class="token operator">-</span>
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: jenkins
  name: gitlab
  labels:
    app: gitlab
spec:
  replicas: 1
  selector:
    matchLabels:
      app: gitlab
  template:
    metadata:
      labels:
        app: gitlab
    spec:
      nodeSelector:
        gitlab: <span class="token string">&quot;true&quot;</span>
      tolerations:
      <span class="token operator">-</span> operator: <span class="token string">&quot;Exists&quot;</span>
      containers:
      <span class="token operator">-</span> name: gitlab
        image:  sameersbn/gitlab:13<span class="token punctuation">.</span>2<span class="token punctuation">.</span>2
        imagePullPolicy: <span class="token string">&quot;IfNotPresent&quot;</span>
        env:
        <span class="token operator">-</span> name: GITLAB_HOST
          value: <span class="token string">&quot;gitlab.nohi.com&quot;</span>
        <span class="token operator">-</span> name: GITLAB_PORT
          value: <span class="token string">&quot;80&quot;</span>
        <span class="token operator">-</span> name: GITLAB_SECRETS_DB_KEY_BASE
          value: <span class="token string">&quot;long-and-random-alpha-numeric-string&quot;</span>
        <span class="token operator">-</span> name: GITLAB_SECRETS_DB_KEY_BASE
          value: <span class="token string">&quot;long-and-random-alpha-numeric-string&quot;</span>
        <span class="token operator">-</span> name: GITLAB_SECRETS_SECRET_KEY_BASE
          value: <span class="token string">&quot;long-and-random-alpha-numeric-string&quot;</span>
        <span class="token operator">-</span> name: GITLAB_SECRETS_OTP_KEY_BASE
          value: <span class="token string">&quot;long-and-random-alpha-numeric-string&quot;</span>
        <span class="token operator">-</span> name: DB_HOST
          value: <span class="token string">&quot;postgres&quot;</span>
        <span class="token operator">-</span> name: DB_NAME
          value: <span class="token string">&quot;gitlab&quot;</span>
        <span class="token operator">-</span> name: DB_USER
          valueFrom:
            secretKeyRef:
              name: gitlab-secret
              key: postgres<span class="token punctuation">.</span>user<span class="token punctuation">.</span>root
        <span class="token operator">-</span> name: DB_PASS
          valueFrom:
            secretKeyRef:
              name: gitlab-secret
              key: postgres<span class="token punctuation">.</span><span class="token function">pwd</span><span class="token punctuation">.</span>root
        <span class="token operator">-</span> name: REDIS_HOST
          value: <span class="token string">&quot;redis&quot;</span>
        <span class="token operator">-</span> name: REDIS_PORT
          value: <span class="token string">&quot;6379&quot;</span>
        ports:
        <span class="token operator">-</span> containerPort: 80
        resources:
          limits:
            cpu: 2000m
            memory: 5048Mi
          requests:
            cpu: 100m
            memory: 500Mi
        volumeMounts:
        <span class="token operator">-</span> mountPath: <span class="token operator">/</span>home/git/<span class="token keyword">data</span>
          name: <span class="token keyword">data</span>
      volumes:
      <span class="token operator">-</span> name: <span class="token keyword">data</span>
        hostPath:
          path: <span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>lib/gitlab/

<span class="token comment">#部署到k8s-worker2节点，由于本地环境k8s-worker1资源较多，改为worker1</span>
$ kubectl label node k8s-worker2 gitlab=true

<span class="token comment"># 创建</span>
$ kubectl create <span class="token operator">-</span>f gitlab<span class="token punctuation">.</span>yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><p>配置hosts解析：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>10<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>181 gitlab<span class="token punctuation">.</span>nohi<span class="token punctuation">.</span>com
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><em>设置root密码</em></p><p>访问http://gitlab.nohi.com，设置管理员密码</p><p><em>配置k8s-master节点的hosts</em></p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ <span class="token function">echo</span> <span class="token string">&quot;10.0.0.181 gitlab.nohi.com&quot;</span> &gt;&gt;<span class="token operator">/</span>etc/hosts
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><em>myblog项目推送到gitlab</em></p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>mkdir demo
<span class="token function">cp</span> <span class="token operator">-</span>r myblog demo/
cd demo/myblog
git remote rename origin old-origin
git remote add origin http:<span class="token operator">/</span><span class="token operator">/</span>gitlab<span class="token punctuation">.</span>nohi<span class="token punctuation">.</span>com/root/myblog<span class="token punctuation">.</span>git
git push <span class="token operator">-</span>u origin <span class="token operator">--</span>all
git push <span class="token operator">-</span>u origin <span class="token operator">--</span>tags

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><em>钉钉推送</em></p>`,43),$={href:"https://ding-doc.dingtalk.com/doc#/serverapi2/qf2nxq",target:"_blank",rel:"noopener noreferrer"},P=t(`<ul><li><p>配置机器人</p></li><li><p>试验发送消息</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ curl <span class="token string">&#39;https://oapi.dingtalk.com/robot/send?access_token=67e81175c6ebacb1307e83f62680f36fbcf4524e8f43971cf2fb2049bc58111d&#39;</span> \\
   <span class="token operator">-</span>H <span class="token string">&#39;Content-Type: application/json&#39;</span> \\
   <span class="token operator">-</span>d <span class="token string">&#39;{&quot;msgtype&quot;: &quot;text&quot;, 
        &quot;text&quot;: {
             &quot;content&quot;: &quot;我就是我, 是不一样的烟火&quot;
        }
      }&#39;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h6 id="演示过程" tabindex="-1"><a class="header-anchor" href="#演示过程" aria-hidden="true">#</a> 演示过程</h6><p>流程示意图：</p><p><img src="`+g+'" alt=""></p><ol><li><p>安装gitlab plugin</p><p>插件中心搜索并安装gitlab，直接安装即可</p></li><li><p>配置Gitlab</p><p>系统管理-&gt;系统配置-&gt;Gitlab，其中的API Token，需要从下个步骤中获取</p><p><img src="'+h+`" alt=""></p></li><li><p>获取AccessToken</p><p>登录gitlab，选择user-&gt;Settings-&gt;access tokens新建一个访问token</p></li><li><p>配置host解析</p><p>由于我们的Jenkins和gitlab域名是本地解析，因此需要让gitlab和Jenkins服务可以解析到对方的域名。两种方式：</p><ul><li><p>在容器内配置hosts</p></li><li><p>配置coredns的静态解析</p><blockquote><p>kubectl -n kube-system edit cm coredns -o yaml</p></blockquote><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>        hosts <span class="token punctuation">{</span>
            10<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>181 jenkins<span class="token punctuation">.</span>nohi<span class="token punctuation">.</span>com  gitlab<span class="token punctuation">.</span>nohi<span class="token punctuation">.</span>com
            fallthrough
        <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul></li><li><p>创建自由风格项目</p><ul><li>gitlab connection 选择为刚创建的gitlab</li><li>源码管理选择Git，填项项目地址</li><li>新建一个 Credentials 认证，使用用户名密码方式，配置gitlab的用户和密码</li><li>构建触发器选择 Build when a change is pushed to GitLab</li><li>生成一个Secret token</li><li>保存</li></ul></li><li><p>到gitlab配置webhook</p><ul><li>进入项目下settings-&gt;Integrations</li><li>URL： http://jenkins.nohi.com/project/free</li><li>Secret Token 填入在Jenkins端生成的token</li><li>Add webhook</li><li>test push events，报错：Requests to the local network are not allowed</li></ul></li><li><p>设置gitlab允许向本地网络发送webhook请求</p><p>访问 Admin Aera -&gt; Settings -&gt; Network ，展开Outbound requests</p><p>Collapse，勾选第一项即可。再次test push events，成功。</p><p><img src="`+q+'" alt=""></p></li><li><p>配置free项目，增加构建步骤，执行shell，将发送钉钉消息的shell保存</p></li><li><p>提交代码到gitlab仓库，查看构建是否自动执行</p></li></ol><blockquote></blockquote><h5 id="master-slaves-agent-模式" tabindex="-1"><a class="header-anchor" href="#master-slaves-agent-模式" aria-hidden="true">#</a> Master-Slaves（agent）模式</h5><p>上面演示的任务，默认都是在master节点执行的，多个任务都在master节点执行，对master节点的性能会造成一定影响，如何将任务分散到不同的节点，做成多slave的方式？</p><ol><li><p>添加slave节点</p><ul><li>系统管理 -&gt; 节点管理 -&gt; 新建节点</li><li>比如添加10.0.0.183，选择固定节点，保存</li><li>远程工作目录/opt/jenkins_jobs</li><li>标签为任务选择节点的依据，如10.0.0.183</li><li>启动方式选择通过java web启动代理，代理是运行jar包，通过JNLP（是一种允许客户端启动托管在远程Web服务器上的应用程序的协议 ）启动连接到master节点服务中</li></ul><p><img src="'+y+`" alt=""></p></li><li><p>执行java命令启动agent服务</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token comment">## 登录10.0.0.183，下载agent.jar</span>
$ wget http:<span class="token operator">/</span><span class="token operator">/</span>jenkins<span class="token punctuation">.</span>nohi<span class="token punctuation">.</span>com/jnlpJars/agent<span class="token punctuation">.</span>jar
<span class="token comment">## 会提示找不到agent错误，因为没有配置地址解析，由于连接jenkins master会通过50000端口，直接使用cluster-ip</span>
$ kubectl <span class="token operator">-</span>n jenkins get svc <span class="token comment">#在master节点执行查询cluster-ip地址</span>
NAME      <span class="token function">TYPE</span>        CLUSTER-IP      EXTERNAL-IP   PORT<span class="token punctuation">(</span>S<span class="token punctuation">)</span>              AGE
jenkins   ClusterIP   10<span class="token punctuation">.</span>103<span class="token punctuation">.</span>114<span class="token punctuation">.</span>89   &lt;none&gt;        8080/TCP<span class="token punctuation">,</span>50000/TCP   4h8m

<span class="token comment">## 再次回到183节点</span>
$ wget 10<span class="token punctuation">.</span>103<span class="token punctuation">.</span>114<span class="token punctuation">.</span>89:8080/jnlpJars/agent<span class="token punctuation">.</span>jar
$ java <span class="token operator">-</span>jar agent<span class="token punctuation">.</span>jar <span class="token operator">-</span>jnlpUrl http:<span class="token operator">/</span><span class="token operator">/</span>10<span class="token punctuation">.</span>103<span class="token punctuation">.</span>114<span class="token punctuation">.</span>89:8080/computer/10<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>183/slave-agent<span class="token punctuation">.</span>jnlp <span class="token operator">-</span>secret 45497608b3cfc4d022334d90f2a1cd37999c01a65fa1857c9c5d29036e1f2be8 <span class="token operator">-</span>workDir <span class="token string">&quot;/opt/jenkins_jobs&quot;</span>
<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
INFO: Remoting server accepts the following protocols: <span class="token namespace">[JNLP4-connect, Ping]</span>
Apr 01<span class="token punctuation">,</span> 2020 7:03:51 PM hudson<span class="token punctuation">.</span>remoting<span class="token punctuation">.</span>jnlp<span class="token punctuation">.</span>Main<span class="token variable">$CuiListener</span> status
INFO: Agent discovery successful
  Agent address: 10<span class="token punctuation">.</span>99<span class="token punctuation">.</span>204<span class="token punctuation">.</span>208
  Agent port:    50000
  Identity:      e4:46:3a:de:86:24:8e:15:09:13:3d:a7:4e:07:04:37
Apr 01<span class="token punctuation">,</span> 2020 7:03:51 PM hudson<span class="token punctuation">.</span>remoting<span class="token punctuation">.</span>jnlp<span class="token punctuation">.</span>Main<span class="token variable">$CuiListener</span> status
INFO: Handshaking
Apr 01<span class="token punctuation">,</span> 2020 7:03:51 PM hudson<span class="token punctuation">.</span>remoting<span class="token punctuation">.</span>jnlp<span class="token punctuation">.</span>Main<span class="token variable">$CuiListener</span> status
INFO: Connecting to 10<span class="token punctuation">.</span>99<span class="token punctuation">.</span>204<span class="token punctuation">.</span>208:50000
Apr 01<span class="token punctuation">,</span> 2020 7:03:51 PM hudson<span class="token punctuation">.</span>remoting<span class="token punctuation">.</span>jnlp<span class="token punctuation">.</span>Main<span class="token variable">$CuiListener</span> status
INFO: Trying protocol: JNLP4-connect
Apr 01<span class="token punctuation">,</span> 2020 7:04:02 PM hudson<span class="token punctuation">.</span>remoting<span class="token punctuation">.</span>jnlp<span class="token punctuation">.</span>Main<span class="token variable">$CuiListener</span> status
INFO: Remote identity confirmed: e4:46:3a:de:86:24:8e:15:09:13:3d:a7:4e:07:04:37
Apr 01<span class="token punctuation">,</span> 2020 7:04:03 PM hudson<span class="token punctuation">.</span>remoting<span class="token punctuation">.</span>jnlp<span class="token punctuation">.</span>Main<span class="token variable">$CuiListener</span> status
INFO: Connected
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>若出现如下错误:</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>SEVERE: http:<span class="token operator">/</span><span class="token operator">/</span>jenkins<span class="token punctuation">.</span>nohi<span class="token punctuation">.</span>com/tcpSlaveAgentListener/ appears to be publishing an invalid X-Instance-Identity<span class="token punctuation">.</span>
java<span class="token punctuation">.</span>io<span class="token punctuation">.</span>IOException: http:<span class="token operator">/</span><span class="token operator">/</span>jenkins<span class="token punctuation">.</span>nohi<span class="token punctuation">.</span>com/tcpSlaveAgentListener/ appears to be publishing an invalid X-Instance-Identity<span class="token punctuation">.</span>
        at org<span class="token punctuation">.</span>jenkinsci<span class="token punctuation">.</span>remoting<span class="token punctuation">.</span>engine<span class="token punctuation">.</span>JnlpAgentEndpointResolver<span class="token punctuation">.</span>resolve<span class="token punctuation">(</span>JnlpAgentEndpointResolver<span class="token punctuation">.</span>java:287<span class="token punctuation">)</span>
        at hudson<span class="token punctuation">.</span>remoting<span class="token punctuation">.</span>Engine<span class="token punctuation">.</span>innerRun<span class="token punctuation">(</span>Engine<span class="token punctuation">.</span>java:694<span class="token punctuation">)</span>
        at hudson<span class="token punctuation">.</span>remoting<span class="token punctuation">.</span>Engine<span class="token punctuation">.</span>run<span class="token punctuation">(</span>Engine<span class="token punctuation">.</span>java:519<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以选择： 配置从节点 -&gt; 高级 -&gt; Tunnel连接位置，参考下图进行设置:</p><p><img src="`+_+'" alt=""></p></li><li><p>查看Jenkins节点列表，新节点已经处于可用状态</p><p><img src="'+f+`" alt=""></p></li><li><p>测试使用新节点执行任务</p><ul><li><p>配置free项目</p></li><li><p>限制项目的运行节点 ，标签表达式选择10.0.0.183</p></li><li><p>立即构建</p></li><li><p>查看构建日志</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>Started by user admin
Running as SYSTEM
Building remotely on 10<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>183 in workspace <span class="token operator">/</span>opt/jenkins_jobs/workspace/free-demo
<span class="token keyword">using</span> credential gitlab-user
Cloning the remote Git repository
Cloning repository http:<span class="token operator">/</span><span class="token operator">/</span>gitlab<span class="token punctuation">.</span>nohi<span class="token punctuation">.</span>com/root/myblog<span class="token punctuation">.</span>git
 &gt; git init <span class="token operator">/</span>opt/jenkins_jobs/workspace/free-demo <span class="token comment"># timeout=10</span>
 <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul></li></ol><blockquote></blockquote><h5 id="jenkins定制化容器" tabindex="-1"><a class="header-anchor" href="#jenkins定制化容器" aria-hidden="true">#</a> Jenkins定制化容器</h5><p>由于每次新部署Jenkins环境，均需要安装很多必要的插件，因此考虑把插件提前做到镜像中</p><p><em>Dockerfile</em></p><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code><span class="token instruction"><span class="token keyword">FROM</span> jenkinsci/blueocean:1.23.2</span>
<span class="token instruction"><span class="token keyword">LABEL</span> maintainer=<span class="token string">&quot;inspur_lyx@hotmail.com&quot;</span></span>

<span class="token comment">## 用最新的插件列表文件替换默认插件文件</span>
<span class="token instruction"><span class="token keyword">COPY</span> plugins.txt /usr/share/jenkins/ref/</span>

<span class="token comment">## 执行插件安装</span>
<span class="token instruction"><span class="token keyword">RUN</span> /usr/local/bin/install-plugins.sh &lt; /usr/share/jenkins/ref/plugins.txt</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><em>plugins.txt</em></p><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code>ace<span class="token operator">-</span>editor<span class="token punctuation">:</span><span class="token number">1.1</span>
allure<span class="token operator">-</span>jenkins<span class="token operator">-</span>plugin<span class="token punctuation">:</span><span class="token number">2.28</span><span class="token number">.1</span>
ant<span class="token punctuation">:</span><span class="token number">1.10</span>
antisamy<span class="token operator">-</span>markup<span class="token operator">-</span>formatter<span class="token punctuation">:</span><span class="token number">1.6</span>
apache<span class="token operator">-</span>httpcomponents<span class="token operator">-</span>client<span class="token operator">-</span><span class="token number">4</span><span class="token operator">-</span>api<span class="token punctuation">:</span><span class="token number">4.5</span><span class="token number">.10</span><span class="token operator">-</span><span class="token number">1.0</span>
authentication<span class="token operator">-</span>tokens<span class="token punctuation">:</span><span class="token number">1.3</span>
<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><em>get_plugin.sh</em></p><blockquote><p>admin:123456@localhost 需要替换成Jenkins的用户名、密码及访问地址</p></blockquote><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token comment">#!/usr/bin/env bash</span>
curl <span class="token operator">-</span>sSL  <span class="token string">&quot;http://admin:123456@localhost:8080/pluginManager/api/xml?depth=1&amp;xpath=/*/*/shortName|/*/*/version&amp;wrapper=plugins&quot;</span> <span class="token punctuation">|</span> perl <span class="token operator">-</span>pe <span class="token string">&#39;s/.*?&lt;shortName&gt;([\\w-]+).*?&lt;version&gt;([^&lt;]+)()(&lt;\\/\\w+&gt;)+/\\1:\\2\\n/g&#39;</span><span class="token punctuation">|</span>sed <span class="token string">&#39;s/ /:/&#39;</span> &gt; plugins<span class="token punctuation">.</span>txt

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token comment">## 执行构建，定制jenkins容器</span>
$ docker build <span class="token punctuation">.</span> <span class="token operator">-</span>t 10<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>181:5000/jenkins:v20200414 <span class="token operator">-</span>f Dockerfile
$ docker push 10<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>181:5000/jenkins:v20200414

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>至此，我们可以使用定制化的镜像启动jenkins服务</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token comment">## 删掉当前服务</span>
$ kubectl delete <span class="token operator">-</span>f jenkins-all<span class="token punctuation">.</span>yaml

<span class="token comment">## 删掉已挂载的数据</span>
$ <span class="token function">rm</span> <span class="token operator">-</span>rf <span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>jenkins_home

<span class="token comment">## 替换使用定制化镜像</span>
$ sed <span class="token operator">-</span>i <span class="token string">&#39;s#jenkinsci/blueocean#10.0.0.181:5000/jenkins:v20200404#g&#39;</span> jenkins-all<span class="token punctuation">.</span>yaml

<span class="token comment">## 重新创建服务</span>
$ kubectl create <span class="token operator">-</span>f jenkins-all<span class="token punctuation">.</span>yaml

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="本章小结" tabindex="-1"><a class="header-anchor" href="#本章小结" aria-hidden="true">#</a> 本章小结</h5><p>自由风格项目弊端：</p><ul><li>任务的完成需要在Jenkins端维护大量的配置</li><li>没法做版本控制</li><li>可读性、可移植性很差，不够优雅</li></ul><blockquote></blockquote><h4 id="流水线入门" tabindex="-1"><a class="header-anchor" href="#流水线入门" aria-hidden="true">#</a> 流水线入门</h4><p><img src="`+w+'" alt=""></p>',28),O={href:"https://jenkins.io/zh/doc/book/pipeline/getting-started/",target:"_blank",rel:"noopener noreferrer"},N=t('<p><img src="'+S+'" alt=""></p><p>为什么叫做流水线，和工厂产品的生产线类似，pipeline是从源码到发布到线上环境。关于流水线，需要知道的几个点：</p><ul><li><p>重要的功能插件，帮助Jenkins定义了一套工作流框架；</p></li><li><p>Pipeline 的实现方式是一套 Groovy DSL（ 领域专用语言 ），所有的发布流程都可以表述为一段 Groovy 脚本；</p></li><li><p>将WebUI上需要定义的任务，以脚本代码的方式表述出来；</p></li><li><p>帮助jenkins实现持续集成CI（Continue Integration）和持续部署CD（Continue Deliver）的重要手段；</p></li></ul><h5 id="流水线基础语法" tabindex="-1"><a class="header-anchor" href="#流水线基础语法" aria-hidden="true">#</a> 流水线基础语法</h5>',4),D={href:"https://jenkins.io/zh/doc/book/pipeline/syntax/",target:"_blank",rel:"noopener noreferrer"},L=t(`<p>两种语法类型：</p><ul><li>Scripted Pipeline，脚本式流水线，最初支持的类型</li><li>Declarative Pipeline，声明式流水线，为Pipeline plugin在2.5版本之后新增的一种脚本类型，后续Open Blue Ocean所支持的类型。与原先的Scripted Pipeline一样，都可以用来编写脚本。Declarative Pipeline 是后续Open Blue Ocean所支持的类型，写法简单，支持内嵌Scripted Pipeline代码</li></ul><p><em>为与BlueOcean脚本编辑器兼容，通常建议使用Declarative Pipeline的方式进行编写,从jenkins社区的动向来看，很明显这种语法结构也会是未来的趋势。</em></p><h6 id="脚本示例" tabindex="-1"><a class="header-anchor" href="#脚本示例" aria-hidden="true">#</a> 脚本示例</h6><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code>pipeline <span class="token punctuation">{</span> 
    agent <span class="token punctuation">{</span>label &#39;<span class="token number">10.0</span>.<span class="token number">0.183</span>&#39;<span class="token punctuation">}</span>
    environment <span class="token punctuation">{</span> 
        PROJECT = &#39;myblog&#39;
    <span class="token punctuation">}</span>
    stages <span class="token punctuation">{</span>
        stage(&#39;Checkout&#39;) <span class="token punctuation">{</span> 
            steps <span class="token punctuation">{</span> 
                checkout scm 
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        stage(&#39;Build&#39;) <span class="token punctuation">{</span> 
            steps <span class="token punctuation">{</span> 
                sh &#39;make&#39; 
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        stage(&#39;Test&#39;)<span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                sh &#39;make check&#39;
                junit &#39;reports<span class="token comment">/**/</span>*.xml&#39; 
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        stage(&#39;Deploy&#39;) <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                sh &#39;make publish&#39;
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
	post <span class="token punctuation">{</span>
        success <span class="token punctuation">{</span> 
            echo &#39;Congratulations!&#39;
        <span class="token punctuation">}</span>
		failure <span class="token punctuation">{</span> 
            echo &#39;Oh no!&#39;
        <span class="token punctuation">}</span>
        always <span class="token punctuation">{</span> 
            echo &#39;I will always say Hello again!&#39;
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="脚本解释" tabindex="-1"><a class="header-anchor" href="#脚本解释" aria-hidden="true">#</a> 脚本解释：</h6>`,6),B=t(`<li><p><code>checkout</code>步骤为检出代码; <code>scm</code>是一个特殊变量，指示<code>checkout</code>步骤克隆触发此Pipeline运行的特定修订</p></li><li><p>agent：指明使用哪个agent节点来执行任务，定义于pipeline顶层或者stage内部</p><ul><li><p>any，可以使用任意可用的agent来执行</p></li><li><p>label，在提供了标签的 Jenkins 环境中可用的代理上执行流水线或阶段。 例如: <code>agent { label &#39;my-defined-label&#39; }</code>，最常见的使用方式</p></li><li><p>none，当在 <code>pipeline</code> 块的顶部没有全局代理， 该参数将会被分配到整个流水线的运行中并且每个 <code>stage</code> 部分都需要包含他自己的 <code>agent</code> 部分。比如: <code>agent none</code></p></li><li><p>docker， 使用给定的容器执行流水线或阶段。 在指定的节点中，通过运行容器来执行任务</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code>agent <span class="token punctuation">{</span>
    docker <span class="token punctuation">{</span>
        image &#39;maven<span class="token operator">:</span><span class="token number">3</span>-alpine&#39;
        label &#39;my-defined-label&#39;
        args  &#39;-v /tmp<span class="token operator">:</span>/tmp&#39;
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul></li><li><p>options: 允许从流水线内部配置特定于流水线的选项。</p><ul><li>buildDiscarder , 为最近的流水线运行的特定数量保存组件和控制台输出。例如: <code>options { buildDiscarder(logRotator(numToKeepStr: &#39;10&#39;)) }</code></li><li>disableConcurrentBuilds ,不允许同时执行流水线。 可被用来防止同时访问共享资源等。 例如: <code>options { disableConcurrentBuilds() }</code></li><li>timeout ,设置流水线运行的超时时间, 在此之后，Jenkins将中止流水线。例如: <code>options { timeout(time: 1, unit: &#39;HOURS&#39;) }</code></li><li>retry，在失败时, 重新尝试整个流水线的指定次数。 For example: <code>options { retry(3) }</code></li></ul></li><li><p>environment: 指令制定一个 键-值对序列，该序列将被定义为所有步骤的环境变量</p></li>`,4),U={href:"https://jenkins.io/zh/doc/book/pipeline/syntax/#stage",target:"_blank",rel:"noopener noreferrer"},J=n("code",null,"stages",-1),K=n("code",null,"stages",-1),H={href:"https://jenkins.io/zh/doc/book/pipeline/syntax/#stage",target:"_blank",rel:"noopener noreferrer"},F=t(`<div class="language-groovy line-numbers-mode" data-ext="groovy"><pre class="language-groovy"><code>pipeline <span class="token punctuation">{</span>
    agent any
    stages <span class="token punctuation">{</span> 
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">&#39;Example&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                echo <span class="token string">&#39;Hello World&#39;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1),z=n("code",null,"stage",-1),Y={href:"https://jenkins.io/zh/doc/book/pipeline/syntax/#declarative-steps",target:"_blank",rel:"noopener noreferrer"},V={href:"https://jenkins.io/zh/doc/book/pipeline/syntax/#declarative-steps",target:"_blank",rel:"noopener noreferrer"},W=n("code",null,"post",-1),Q={href:"https://jenkins.io/zh/doc/book/pipeline/syntax/#post-conditions",target:"_blank",rel:"noopener noreferrer"},X=n("code",null,"always",-1),Z=n("code",null,"changed",-1),nn=n("code",null,"failure",-1),sn=n("code",null,"success",-1),an=n("code",null,"unstable",-1),en=n("code",null,"aborted",-1),tn=t("<ul><li>always, 无论流水线或阶段的完成状态如何，都允许在 <code>post</code> 部分运行该步骤</li><li>changed, 当前流水线或阶段的完成状态与它之前的运行不同时，才允许在 <code>post</code> 部分运行该步骤</li><li>failure, 当前流水线或阶段的完成状态为&quot;failure&quot;，才允许在 <code>post</code> 部分运行该步骤, 通常web UI是红色</li><li>success, 当前流水线或阶段的完成状态为&quot;success&quot;，才允许在 <code>post</code> 部分运行该步骤, 通常web UI是蓝色或绿色</li><li>unstable, 当前流水线或阶段的完成状态为&quot;unstable&quot;，才允许在 <code>post</code> 部分运行该步骤, 通常由于测试失败,代码违规等造成。通常web UI是黄色</li><li>aborted， 只有当前流水线或阶段的完成状态为&quot;aborted&quot;，才允许在 <code>post</code> 部分运行该步骤, 通常由于流水线被手动的aborted。通常web UI是灰色</li></ul>",1),pn=t(`<p>创建pipeline示意：</p><p>新建任务 -&gt; 流水线</p><p><code>jenkins/pipelines/p1.yaml</code></p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>pipeline <span class="token punctuation">{</span>
   agent <span class="token punctuation">{</span>label <span class="token string">&#39;k8s-worker2&#39;</span><span class="token punctuation">}</span>
   environment <span class="token punctuation">{</span> 
      PROJECT = <span class="token string">&#39;myblog&#39;</span>
   <span class="token punctuation">}</span>
   stages <span class="token punctuation">{</span>
      stage<span class="token punctuation">(</span><span class="token string">&#39;printenv&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
         steps <span class="token punctuation">{</span>
            <span class="token function">echo</span> <span class="token string">&#39;Hello World&#39;</span>
            sh <span class="token string">&#39;printenv&#39;</span>
         <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
      stage<span class="token punctuation">(</span><span class="token string">&#39;check&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
         steps <span class="token punctuation">{</span>
            checkout<span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token variable">$class</span>: <span class="token string">&#39;GitSCM&#39;</span><span class="token punctuation">,</span> branches: <span class="token punctuation">[</span><span class="token punctuation">[</span>name: <span class="token string">&#39;*/master&#39;</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">,</span> doGenerateSubmoduleConfigurations: false<span class="token punctuation">,</span> extensions: <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> submoduleCfg: <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> userRemoteConfigs: <span class="token punctuation">[</span><span class="token punctuation">[</span>credentialsId: <span class="token string">&#39;gitlab-root&#39;</span><span class="token punctuation">,</span> url: <span class="token string">&#39;http://gitlab.nohi.com/root/myblog.git&#39;</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
         <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
      stage<span class="token punctuation">(</span><span class="token string">&#39;build-image&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
         steps <span class="token punctuation">{</span>
            sh <span class="token string">&#39;docker build . -t myblog:latest -f Dockerfile&#39;</span>
         <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
      stage<span class="token punctuation">(</span><span class="token string">&#39;send-msg&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
         steps <span class="token punctuation">{</span>
            sh <span class="token string">&quot;&quot;</span><span class="token string">&quot;
            curl &#39;https://oapi.dingtalk.com/robot/send?access_token=87041258b2b66a909c2ec6e944f485a0ce1b20f30dc6edfc5d36c1b895b61803&#39; \\
   -H &#39;Content-Type: application/json&#39; \\
   -d &#39;{&quot;</span>msgtype<span class="token string">&quot;: &quot;</span>text<span class="token string">&quot;, 
        &quot;</span>text<span class="token string">&quot;: {
             &quot;</span>content<span class="token string">&quot;: &quot;</span>我就是我<span class="token punctuation">,</span> 是不一样的烟火 <span class="token keyword">from</span> NOHI<span class="token string">&quot;
        }
      }&#39;
      &quot;</span><span class="token string">&quot;&quot;</span>
         <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
   <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>点击“立即构建”，同样的，我们可以配置触发器，使用webhook的方式接收项目的push事件，</p><ul><li>构建触发器选择 Build when a change is pushed to GitLab.</li><li>生成 Secret token</li><li>配置gitlab，创建webhook，发送test push events测试</li></ul><h6 id="blue-ocean" tabindex="-1"><a class="header-anchor" href="#blue-ocean" aria-hidden="true">#</a> Blue Ocean:</h6>`,7),on={href:"https://jenkins.io/zh/doc/book/blueocean/getting-started/",target:"_blank",rel:"noopener noreferrer"},ln=t(`<p>我们需要知道的几点：</p><ul><li>是一个插件， 旨在为Pipeline提供丰富的体验 ；</li><li>连续交付（CD）Pipeline的复杂可视化，允许快速和直观地了解Pipeline的状态；</li><li>目前支持的类型仅针对于Pipeline，尚不能替代Jenkins 经典版UI</li></ul><p>思考：</p><ol><li>每个项目都把大量的pipeline脚本写在Jenkins端，对于谁去维护及维护成本是一个问题</li><li>没法做版本控制</li></ol><blockquote></blockquote><h5 id="jenkinsflie" tabindex="-1"><a class="header-anchor" href="#jenkinsflie" aria-hidden="true">#</a> Jenkinsflie</h5><p>Jenkins Pipeline 提供了一套可扩展的工具，用于将“简单到复杂”的交付流程实现为“持续交付即代码”。Jenkins Pipeline 的定义通常被写入到一个文本文件（称为 <code>Jenkinsfile</code> ）中，该文件可以被放入项目的源代码控制库中。</p><h6 id="演示1-使用jenkinsfile管理pipeline" tabindex="-1"><a class="header-anchor" href="#演示1-使用jenkinsfile管理pipeline" aria-hidden="true">#</a> 演示1：使用Jenkinsfile管理<strong>pipeline</strong></h6><ul><li>在项目中新建Jenkinsfile文件，拷贝已有script内容</li><li>配置pipeline任务，流水线定义为Pipeline Script from SCM</li><li>执行push 代码测试</li></ul><p>Jenkinsfile:</p><p><code>jenkins/pipelines/p2.yaml</code></p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>pipeline <span class="token punctuation">{</span>
   agent <span class="token punctuation">{</span> label <span class="token string">&#39;10.0.0.183&#39;</span><span class="token punctuation">}</span>

   stages <span class="token punctuation">{</span>
      stage<span class="token punctuation">(</span><span class="token string">&#39;printenv&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
         steps <span class="token punctuation">{</span>
            <span class="token function">echo</span> <span class="token string">&#39;Hello World&#39;</span>
            sh <span class="token string">&#39;printenv&#39;</span>
         <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
      stage<span class="token punctuation">(</span><span class="token string">&#39;check&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
         steps <span class="token punctuation">{</span>
            checkout<span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token variable">$class</span>: <span class="token string">&#39;GitSCM&#39;</span><span class="token punctuation">,</span> branches: <span class="token punctuation">[</span><span class="token punctuation">[</span>name: <span class="token string">&#39;*/master&#39;</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">,</span> doGenerateSubmoduleConfigurations: false<span class="token punctuation">,</span> extensions: <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> submoduleCfg: <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> userRemoteConfigs: <span class="token punctuation">[</span><span class="token punctuation">[</span>credentialsId: <span class="token string">&#39;gitlab-user&#39;</span><span class="token punctuation">,</span> url: <span class="token string">&#39;http://gitlab.nohi.com/root/myblog.git&#39;</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
         <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
      stage<span class="token punctuation">(</span><span class="token string">&#39;build-image&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
         steps <span class="token punctuation">{</span>
            retry<span class="token punctuation">(</span>2<span class="token punctuation">)</span> <span class="token punctuation">{</span> sh <span class="token string">&#39;docker build . -t myblog:latest&#39;</span><span class="token punctuation">}</span>
         <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
      stage<span class="token punctuation">(</span><span class="token string">&#39;send-msg&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
         steps <span class="token punctuation">{</span>
            sh <span class="token string">&quot;&quot;</span><span class="token string">&quot;
            curl &#39;https://oapi.dingtalk.com/robot/send?access_token=67e81175c6ebacb1307e83f62680f36fbcf4524e8f43971cf2fb2049bc58723d&#39; \\
   -H &#39;Content-Type: application/json&#39; \\
   -d &#39;{&quot;</span>msgtype<span class="token string">&quot;: &quot;</span>text<span class="token string">&quot;, 
        &quot;</span>text<span class="token string">&quot;: {
             &quot;</span>content<span class="token string">&quot;: &quot;</span>我就是我<span class="token punctuation">,</span> 是不一样的烟火<span class="token string">&quot;
        }
      }&#39;
      &quot;</span><span class="token string">&quot;&quot;</span>
         <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
   <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="演示2-优化及丰富流水线内容" tabindex="-1"><a class="header-anchor" href="#演示2-优化及丰富流水线内容" aria-hidden="true">#</a> 演示2：优化及丰富流水线内容</h6><ul><li><p>优化代码检出阶段</p><p>由于目前已经配置了使用git仓库地址，且使用SCM来检测项目，因此代码检出阶段完全没有必要再去指定一次</p></li><li><p>构建镜像的tag使用git的commit id</p></li><li><p>增加post阶段的消息通知，丰富通知内容</p></li><li><p>配置webhook，实现myblog代码推送后，触发Jenkinsfile任务执行</p></li></ul><p><code>jenkins/pipelines/p3.yaml</code></p><div class="language-groovy line-numbers-mode" data-ext="groovy"><pre class="language-groovy"><code>pipeline <span class="token punctuation">{</span>
    agent <span class="token punctuation">{</span> label <span class="token string">&#39;k8s-worker2&#39;</span><span class="token punctuation">}</span>

    stages <span class="token punctuation">{</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">&#39;printenv&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
            echo <span class="token string">&#39;Hello World&#39;</span>
            sh <span class="token string">&#39;printenv&#39;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">&#39;check&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                checkout scm
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">&#39;build-image&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
            	<span class="token function">retry</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> sh <span class="token string">&#39;docker build . -t myblog:\${GIT_COMMIT}&#39;</span><span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    post <span class="token punctuation">{</span>
        success <span class="token punctuation">{</span> 
            echo <span class="token string">&#39;Congratulations!&#39;</span>
            sh <span class="token interpolation-string"><span class="token string">&quot;&quot;&quot;
                curl &#39;https://oapi.dingtalk.com/robot/send?access_token=87041258b2b66a909c2ec6e944f485a0ce1b20f30dc6edfc5d36c1b895b61803&#39; \\
                    -H &#39;Content-Type: application/json&#39; \\
                    -d &#39;{&quot;msgtype&quot;: &quot;text&quot;, 
                            &quot;text&quot;: {
                                &quot;content&quot;: &quot;😄👍构建成功👍😄\\n 关键字：NOHI\\n 项目名称: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token expression">JOB_BASE_NAME</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\\n Commit Id: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token expression">GIT_COMMIT</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\\n 构建地址：</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token expression">RUN_DISPLAY_URL</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">&quot;
                        }
                }&#39;
            &quot;&quot;&quot;</span></span>
        <span class="token punctuation">}</span>
        failure <span class="token punctuation">{</span>
            echo <span class="token string">&#39;Oh no!&#39;</span>
            sh <span class="token interpolation-string"><span class="token string">&quot;&quot;&quot;
                curl &#39;https://oapi.dingtalk.com/robot/send?access_token=87041258b2b66a909c2ec6e944f485a0ce1b20f30dc6edfc5d36c1b895b61803&#39; \\
                    -H &#39;Content-Type: application/json&#39; \\
                    -d &#39;{&quot;msgtype&quot;: &quot;text&quot;, 
                            &quot;text&quot;: {
                                &quot;content&quot;: &quot;😖❌构建失败❌😖\\n 关键字：NOHI\\n 项目名称: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token expression">JOB_BASE_NAME</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\\n Commit Id: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token expression">GIT_COMMIT</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\\n 构建地址：</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token expression">RUN_DISPLAY_URL</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">&quot;
                        }
                }&#39;
            &quot;&quot;&quot;</span></span>
        <span class="token punctuation">}</span>
        always <span class="token punctuation">{</span> 
            echo <span class="token string">&#39;I will always say Hello again!&#39;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="演示3-使用k8s部署服务" tabindex="-1"><a class="header-anchor" href="#演示3-使用k8s部署服务" aria-hidden="true">#</a> 演示3：使用k8s部署服务</h6><ul><li><p>新建deploy目录，将k8s所需的文件放到deploy目录中</p></li><li><p>将镜像地址改成模板，在pipeline中使用新构建的镜像进行替换</p></li><li><p>执行kubectl apply -f deploy应用更改，需要配置kubectl认证</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ scp <span class="token operator">-</span>r k8s-master:<span class="token operator">/</span>root/<span class="token punctuation">.</span>kube <span class="token operator">/</span>root
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li></ul><p><code>jenkins/pipelines/p4.yaml</code></p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>pipeline <span class="token punctuation">{</span>
    agent <span class="token punctuation">{</span> label <span class="token string">&#39;10.0.0.183&#39;</span><span class="token punctuation">}</span>

    environment <span class="token punctuation">{</span>
        IMAGE_REPO = <span class="token string">&quot;10.0.0.181:5000/myblog&quot;</span>
    <span class="token punctuation">}</span>

    stages <span class="token punctuation">{</span>
        stage<span class="token punctuation">(</span><span class="token string">&#39;printenv&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
              <span class="token function">echo</span> <span class="token string">&#39;Hello World&#39;</span>
              sh <span class="token string">&#39;printenv&#39;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        stage<span class="token punctuation">(</span><span class="token string">&#39;check&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                checkout scm
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        stage<span class="token punctuation">(</span><span class="token string">&#39;build-image&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                retry<span class="token punctuation">(</span>2<span class="token punctuation">)</span> <span class="token punctuation">{</span> sh <span class="token string">&#39;docker build . -t \${IMAGE_REPO}:\${GIT_COMMIT}&#39;</span><span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        stage<span class="token punctuation">(</span><span class="token string">&#39;push-image&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                retry<span class="token punctuation">(</span>2<span class="token punctuation">)</span> <span class="token punctuation">{</span> sh <span class="token string">&#39;docker push \${IMAGE_REPO}:\${GIT_COMMIT}&#39;</span><span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        stage<span class="token punctuation">(</span><span class="token string">&#39;deploy&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                sh <span class="token string">&quot;sed -i &#39;s#{{IMAGE_URL}}#\${IMAGE_REPO}:\${GIT_COMMIT}#g&#39; deploy/*&quot;</span>
                timeout<span class="token punctuation">(</span>time: 1<span class="token punctuation">,</span> unit: <span class="token string">&#39;MINUTES&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    sh <span class="token string">&quot;kubectl apply -f deploy/&quot;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    post <span class="token punctuation">{</span>
        success <span class="token punctuation">{</span> 
            <span class="token function">echo</span> <span class="token string">&#39;Congratulations!&#39;</span>
            sh <span class="token string">&quot;&quot;</span><span class="token string">&quot;
                curl &#39;https://oapi.dingtalk.com/robot/send?access_token=67e81175c6ebacb1307e83f62680f36fbcf4524e8f43971cf2fb2049bc58723d&#39; \\
                    -H &#39;Content-Type: application/json&#39; \\
                    -d &#39;{&quot;</span>msgtype<span class="token string">&quot;: &quot;</span>text<span class="token string">&quot;, 
                            &quot;</span>text<span class="token string">&quot;: {
                                &quot;</span>content<span class="token string">&quot;: &quot;</span>😄👍构建成功👍😄\\n 关键字：myblog\\n 项目名称: $<span class="token punctuation">{</span>JOB_BASE_NAME<span class="token punctuation">}</span>\\n Commit Id: $<span class="token punctuation">{</span>GIT_COMMIT<span class="token punctuation">}</span>\\n 构建地址：$<span class="token punctuation">{</span>RUN_DISPLAY_URL<span class="token punctuation">}</span><span class="token string">&quot;
                        }
                }&#39;
            &quot;</span><span class="token string">&quot;&quot;</span>
        <span class="token punctuation">}</span>
        failure <span class="token punctuation">{</span>
            <span class="token function">echo</span> <span class="token string">&#39;Oh no!&#39;</span>
            sh <span class="token string">&quot;&quot;</span><span class="token string">&quot;
                curl &#39;https://oapi.dingtalk.com/robot/send?access_token=67e81175c6ebacb1307e83f62680f36fbcf4524e8f43971cf2fb2049bc58723d&#39; \\
                    -H &#39;Content-Type: application/json&#39; \\
                    -d &#39;{&quot;</span>msgtype<span class="token string">&quot;: &quot;</span>text<span class="token string">&quot;, 
                            &quot;</span>text<span class="token string">&quot;: {
                                &quot;</span>content<span class="token string">&quot;: &quot;</span>😖❌构建失败❌😖\\n 关键字：nohi\\n 项目名称: $<span class="token punctuation">{</span>JOB_BASE_NAME<span class="token punctuation">}</span>\\n Commit Id: $<span class="token punctuation">{</span>GIT_COMMIT<span class="token punctuation">}</span>\\n 构建地址：$<span class="token punctuation">{</span>RUN_DISPLAY_URL<span class="token punctuation">}</span><span class="token string">&quot;
                        }
                }&#39;
            &quot;</span><span class="token string">&quot;&quot;</span>
        <span class="token punctuation">}</span>
        always <span class="token punctuation">{</span> 
            <span class="token function">echo</span> <span class="token string">&#39;I will always say Hello again!&#39;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="演示4-使用凭据管理敏感信息" tabindex="-1"><a class="header-anchor" href="#演示4-使用凭据管理敏感信息" aria-hidden="true">#</a> 演示4：使用凭据管理敏感信息</h6><p>上述Jenkinsfile中存在的问题是敏感信息使用明文，暴漏在代码中，如何管理流水线中的敏感信息（包含账号密码），之前我们在对接gitlab的时候，需要账号密码，已经使用过凭据来管理这类敏感信息，同样的，我们可以使用凭据来存储钉钉的token信息，那么，创建好凭据后，如何在Jenkinsfile中获取已有凭据的内容？</p>`,22),cn=n("code",null,"credentials()",-1),un={href:"https://jenkins.io/zh/doc/book/pipeline/jenkinsfile/#../syntax#environment",target:"_blank",rel:"noopener noreferrer"},rn=n("code",null,"environment",-1),dn={href:"https://jenkins.io/zh/doc/book/pipeline/jenkinsfile/##secret-text",target:"_blank",rel:"noopener noreferrer"},kn={href:"https://jenkins.io/zh/doc/book/pipeline/jenkinsfile/##usernames-and-passwords",target:"_blank",rel:"noopener noreferrer"},vn={href:"https://jenkins.io/zh/doc/book/pipeline/jenkinsfile/##secret-files",target:"_blank",rel:"noopener noreferrer"},mn=n("p",null,"下面的流水线代码片段展示了如何创建一个使用带密码的用户名凭据的环境变量的流水线。",-1),bn=n("p",null,[s("在该示例中，带密码的用户名凭据被分配了环境变量，用来使你的组织或团队以一个公用账户访问 Bitbucket 仓库；这些凭据已在 Jenkins 中配置了凭据 ID "),n("code",null,"jenkins-bitbucket-common-creds"),s("。")],-1),gn={href:"https://jenkins.io/zh/doc/book/pipeline/jenkinsfile/#../syntax#environment",target:"_blank",rel:"noopener noreferrer"},hn=n("code",null,"environment",-1),qn=t(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>environment {
    BITBUCKET_COMMON_CREDS = credentials(&#39;jenkins-bitbucket-common-creds&#39;)
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这实际设置了下面的三个环境变量：</p><ul><li><code>BITBUCKET_COMMON_CREDS</code> - 包含一个以冒号分隔的用户名和密码，格式为 <code>username:password</code>。</li><li><code>BITBUCKET_COMMON_CREDS_USR</code> - 附加的一个仅包含用户名部分的变量。</li><li><code>BITBUCKET_COMMON_CREDS_PSW</code> - 附加的一个仅包含密码部分的变量。</li></ul><div class="language-groovy line-numbers-mode" data-ext="groovy"><pre class="language-groovy"><code>pipeline <span class="token punctuation">{</span>
    agent <span class="token punctuation">{</span>
        <span class="token comment">// 此处定义 agent 的细节</span>
    <span class="token punctuation">}</span>
    environment <span class="token punctuation">{</span>
        <span class="token comment">//顶层流水线块中使用的 environment 指令将适用于流水线中的所有步骤。 </span>
        BITBUCKET_COMMON_CREDS <span class="token operator">=</span> <span class="token function">credentials</span><span class="token punctuation">(</span><span class="token string">&#39;jenkins-bitbucket-common-creds&#39;</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    stages <span class="token punctuation">{</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">&#39;Example stage 1&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 			<span class="token comment">//在一个 stage 中定义的 environment 指令只会将给定的环境变量应用于 stage 中的步骤。</span>
            environment <span class="token punctuation">{</span>
                BITBUCKET_COMMON_CREDS <span class="token operator">=</span> <span class="token function">credentials</span><span class="token punctuation">(</span><span class="token string">&#39;another-credential-id&#39;</span><span class="token punctuation">)</span>
            <span class="token punctuation">}</span>
            steps <span class="token punctuation">{</span>
                <span class="token comment">// </span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">&#39;Example stage 2&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                <span class="token comment">// </span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>因此对Jenkinsfile做改造：</p><p><code>jenkins/pipelines/p5.yaml</code></p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>pipeline <span class="token punctuation">{</span>
    agent <span class="token punctuation">{</span> label <span class="token string">&#39;k8s-worker2&#39;</span><span class="token punctuation">}</span>

    environment <span class="token punctuation">{</span>
        IMAGE_REPO = <span class="token string">&quot;10.0.0.181:5000/myblog&quot;</span>
        DINGTALK_CREDS = credentials<span class="token punctuation">(</span><span class="token string">&#39;dingTalk&#39;</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

    stages <span class="token punctuation">{</span>
        stage<span class="token punctuation">(</span><span class="token string">&#39;printenv&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
            <span class="token function">echo</span> <span class="token string">&#39;Hello World&#39;</span>
            sh <span class="token string">&#39;printenv&#39;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        stage<span class="token punctuation">(</span><span class="token string">&#39;check&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                checkout scm
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        stage<span class="token punctuation">(</span><span class="token string">&#39;build-image&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                retry<span class="token punctuation">(</span>2<span class="token punctuation">)</span> <span class="token punctuation">{</span> sh <span class="token string">&#39;docker build . -t \${IMAGE_REPO}:\${GIT_COMMIT}&#39;</span><span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        stage<span class="token punctuation">(</span><span class="token string">&#39;push-image&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                retry<span class="token punctuation">(</span>2<span class="token punctuation">)</span> <span class="token punctuation">{</span> sh <span class="token string">&#39;docker push \${IMAGE_REPO}:\${GIT_COMMIT}&#39;</span><span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        stage<span class="token punctuation">(</span><span class="token string">&#39;deploy&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                sh <span class="token string">&quot;sed -i &#39;s#{{IMAGE_URL}}#\${IMAGE_REPO}:\${GIT_COMMIT}#g&#39; deploy/*&quot;</span>
                timeout<span class="token punctuation">(</span>time: 1<span class="token punctuation">,</span> unit: <span class="token string">&#39;MINUTES&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    sh <span class="token string">&quot;kubectl apply -f deploy/&quot;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    post <span class="token punctuation">{</span>
        success <span class="token punctuation">{</span> 
            <span class="token function">echo</span> <span class="token string">&#39;Congratulations!&#39;</span>
            sh <span class="token string">&quot;&quot;</span><span class="token string">&quot;
                curl &#39;https://oapi.dingtalk.com/robot/send?access_token=\${DINGTALK_CREDS_PSW}&#39; \\
                    -H &#39;Content-Type: application/json&#39; \\
                    -d &#39;{&quot;</span>msgtype<span class="token string">&quot;: &quot;</span>text<span class="token string">&quot;, 
                            &quot;</span>text<span class="token string">&quot;: {
                                &quot;</span>content<span class="token string">&quot;: &quot;</span>😄👍构建成功👍😄\\n 关键字：NOHI\\n 项目名称: $<span class="token punctuation">{</span>JOB_BASE_NAME<span class="token punctuation">}</span>\\n Commit Id: $<span class="token punctuation">{</span>GIT_COMMIT<span class="token punctuation">}</span>\\n 构建地址：$<span class="token punctuation">{</span>RUN_DISPLAY_URL<span class="token punctuation">}</span><span class="token string">&quot;
                        }
                }&#39;
            &quot;</span><span class="token string">&quot;&quot;</span>
        <span class="token punctuation">}</span>
        failure <span class="token punctuation">{</span>
            <span class="token function">echo</span> <span class="token string">&#39;Oh no!&#39;</span>
            sh <span class="token string">&quot;&quot;</span><span class="token string">&quot;
                curl &#39;https://oapi.dingtalk.com/robot/send?access_token=\${DINGTALK_CREDS_PSW}&#39; \\
                    -H &#39;Content-Type: application/json&#39; \\
                    -d &#39;{&quot;</span>msgtype<span class="token string">&quot;: &quot;</span>text<span class="token string">&quot;, 
                            &quot;</span>text<span class="token string">&quot;: {
                                &quot;</span>content<span class="token string">&quot;: &quot;</span>😖❌构建失败❌😖\\n 关键字：NOHI\\n 项目名称: $<span class="token punctuation">{</span>JOB_BASE_NAME<span class="token punctuation">}</span>\\n Commit Id: $<span class="token punctuation">{</span>GIT_COMMIT<span class="token punctuation">}</span>\\n 构建地址：$<span class="token punctuation">{</span>RUN_DISPLAY_URL<span class="token punctuation">}</span><span class="token string">&quot;
                        }
                }&#39;
            &quot;</span><span class="token string">&quot;&quot;</span>
        <span class="token punctuation">}</span>
        always <span class="token punctuation">{</span> 
            <span class="token function">echo</span> <span class="token string">&#39;I will always say Hello again!&#39;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="本章小结-1" tabindex="-1"><a class="header-anchor" href="#本章小结-1" aria-hidden="true">#</a> 本章小结</h6><p>上面我们已经通过Jenkinsfile完成了最简单的项目的构建和部署，那么我们来思考目前的方式：</p><ol><li>目前都是在项目的单一分支下进行操作，企业内一般会使用feature、develop、release、master等多个分支来管理整个代码提交流程，如何根据不同的分支来做构建？</li><li>构建视图中如何区分不同的分支?</li><li>如何不配置webhook的方式实现构建？</li><li>如何根据不同的分支选择发布到不同的环境(开发、测试、生产)？</li></ol><blockquote></blockquote><h5 id="多分支流水线" tabindex="-1"><a class="header-anchor" href="#多分支流水线" aria-hidden="true">#</a> 多分支流水线</h5>`,12),yn={href:"https://jenkins.io/zh/doc/tutorials/build-a-multibranch-pipeline-project/",target:"_blank",rel:"noopener noreferrer"},_n=t(`<p>我们简化一下流程，假如使用develop分支作为开发分支，master分支作为集成测试分支，看一下如何使用多分支流水线来管理。</p><h6 id="演示1-多分支流水线的使用" tabindex="-1"><a class="header-anchor" href="#演示1-多分支流水线的使用" aria-hidden="true">#</a> 演示1：多分支流水线的使用</h6><ol><li>提交develop分支：</li></ol><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ git checkout <span class="token operator">-</span>b develop
$ git push <span class="token operator">--</span><span class="token function">set-upstream</span> origin develop
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li><p>禁用pipeline项目</p></li><li><p>Jenkins端创建多分支流水线项目</p><ul><li>增加git分支源</li><li>发现标签</li><li>根据名称过滤，develop|master|v.*</li><li>高级克隆，设置浅克隆</li></ul></li></ol><p>保存后，会自动检索项目中所有存在Jenkinsfile文件的分支和标签，若匹配我们设置的过滤正则表达式，则会添加到多分支的构建视图中。所有添加到视图中的分支和标签，会默认执行一次构建任务。</p><h6 id="演示2-美化消息通知内容" tabindex="-1"><a class="header-anchor" href="#演示2-美化消息通知内容" aria-hidden="true">#</a> 演示2：美化消息通知内容</h6><ul><li>添加构建阶段记录</li><li>使用markdown格式，添加构建分支消息</li></ul><p><code>jenkins/pipelines/p6.yaml</code></p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>pipeline <span class="token punctuation">{</span>
    agent <span class="token punctuation">{</span> label <span class="token string">&#39;k8s-worker2&#39;</span><span class="token punctuation">}</span>

    environment <span class="token punctuation">{</span>
        IMAGE_REPO = <span class="token string">&quot;10.0.0.181:5000/myblog&quot;</span>
        DINGTALK_CREDS = credentials<span class="token punctuation">(</span><span class="token string">&#39;dingTalk&#39;</span><span class="token punctuation">)</span>
        TAB_STR = <span class="token string">&quot;\\n                    \\n&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&quot;</span>
    <span class="token punctuation">}</span>

    stages <span class="token punctuation">{</span>
        stage<span class="token punctuation">(</span><span class="token string">&#39;printenv&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                script<span class="token punctuation">{</span>
                    sh <span class="token string">&quot;git log --oneline -n 1 &gt; gitlog.file&quot;</span>
                    env<span class="token punctuation">.</span>GIT_LOG = readFile<span class="token punctuation">(</span><span class="token string">&quot;gitlog.file&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span>trim<span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token punctuation">}</span>
                sh <span class="token string">&#39;printenv&#39;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        stage<span class="token punctuation">(</span><span class="token string">&#39;checkout&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                checkout scm
                script<span class="token punctuation">{</span>
                    env<span class="token punctuation">.</span>BUILD_TASKS = env<span class="token punctuation">.</span>STAGE_NAME <span class="token operator">+</span> <span class="token string">&quot;√...&quot;</span> <span class="token operator">+</span> env<span class="token punctuation">.</span>TAB_STR
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        stage<span class="token punctuation">(</span><span class="token string">&#39;build-image&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                retry<span class="token punctuation">(</span>2<span class="token punctuation">)</span> <span class="token punctuation">{</span> sh <span class="token string">&#39;docker build . -t \${IMAGE_REPO}:\${GIT_COMMIT}&#39;</span><span class="token punctuation">}</span>
                script<span class="token punctuation">{</span>
                    env<span class="token punctuation">.</span>BUILD_TASKS <span class="token operator">+=</span> env<span class="token punctuation">.</span>STAGE_NAME <span class="token operator">+</span> <span class="token string">&quot;√...&quot;</span> <span class="token operator">+</span> env<span class="token punctuation">.</span>TAB_STR
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        stage<span class="token punctuation">(</span><span class="token string">&#39;push-image&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                retry<span class="token punctuation">(</span>2<span class="token punctuation">)</span> <span class="token punctuation">{</span> sh <span class="token string">&#39;docker push \${IMAGE_REPO}:\${GIT_COMMIT}&#39;</span><span class="token punctuation">}</span>
                script<span class="token punctuation">{</span>
                    env<span class="token punctuation">.</span>BUILD_TASKS <span class="token operator">+=</span> env<span class="token punctuation">.</span>STAGE_NAME <span class="token operator">+</span> <span class="token string">&quot;√...&quot;</span> <span class="token operator">+</span> env<span class="token punctuation">.</span>TAB_STR
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        stage<span class="token punctuation">(</span><span class="token string">&#39;deploy&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                sh <span class="token string">&quot;sed -i &#39;s#{{IMAGE_URL}}#\${IMAGE_REPO}:\${GIT_COMMIT}#g&#39; deploy/*&quot;</span>
                timeout<span class="token punctuation">(</span>time: 1<span class="token punctuation">,</span> unit: <span class="token string">&#39;MINUTES&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    sh <span class="token string">&quot;kubectl apply -f deploy/&quot;</span>
                <span class="token punctuation">}</span>
                script<span class="token punctuation">{</span>
                    env<span class="token punctuation">.</span>BUILD_TASKS <span class="token operator">+=</span> env<span class="token punctuation">.</span>STAGE_NAME <span class="token operator">+</span> <span class="token string">&quot;√...&quot;</span> <span class="token operator">+</span> env<span class="token punctuation">.</span>TAB_STR
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    post <span class="token punctuation">{</span>
        success <span class="token punctuation">{</span> 
            <span class="token function">echo</span> <span class="token string">&#39;Congratulations!&#39;</span>
            sh <span class="token string">&quot;&quot;</span><span class="token string">&quot;
                curl &#39;https://oapi.dingtalk.com/robot/send?access_token=\${DINGTALK_CREDS_PSW}&#39; \\
                    -H &#39;Content-Type: application/json&#39; \\
                    -d &#39;{
                        &quot;</span>msgtype<span class="token string">&quot;: &quot;</span>markdown<span class="token string">&quot;,
                        &quot;</span>markdown<span class="token string">&quot;: {
                            &quot;</span>title<span class="token string">&quot;:&quot;</span>myblog<span class="token string">&quot;,
                            &quot;</span>text<span class="token string">&quot;: &quot;</span>😄👍 构建成功 👍😄  \\n*<span class="token operator">*</span>项目名称<span class="token operator">*</span><span class="token operator">*</span>：NOHI  \\n*<span class="token operator">*</span>Git log*<span class="token operator">*</span>: $<span class="token punctuation">{</span>GIT_LOG<span class="token punctuation">}</span>   \\n*<span class="token operator">*</span>构建分支<span class="token operator">*</span><span class="token operator">*</span>: $<span class="token punctuation">{</span>GIT_BRANCH<span class="token punctuation">}</span>   \\n*<span class="token operator">*</span>构建地址<span class="token operator">*</span><span class="token operator">*</span>：$<span class="token punctuation">{</span>RUN_DISPLAY_URL<span class="token punctuation">}</span>  \\n*<span class="token operator">*</span>构建任务<span class="token operator">*</span><span class="token operator">*</span>：$<span class="token punctuation">{</span>BUILD_TASKS<span class="token punctuation">}</span><span class="token string">&quot;
                        }
                    }&#39;
            &quot;</span><span class="token string">&quot;&quot;</span> 
        <span class="token punctuation">}</span>
        failure <span class="token punctuation">{</span>
            <span class="token function">echo</span> <span class="token string">&#39;Oh no!&#39;</span>
            sh <span class="token string">&quot;&quot;</span><span class="token string">&quot;
                curl &#39;https://oapi.dingtalk.com/robot/send?access_token=\${DINGTALK_CREDS_PSW}&#39; \\
                    -H &#39;Content-Type: application/json&#39; \\
                    -d &#39;{
                        &quot;</span>msgtype<span class="token string">&quot;: &quot;</span>markdown<span class="token string">&quot;,
                        &quot;</span>markdown<span class="token string">&quot;: {
                            &quot;</span>title<span class="token string">&quot;:&quot;</span>myblog<span class="token string">&quot;,
                            &quot;</span>text<span class="token string">&quot;: &quot;</span>😖❌ 构建失败 ❌😖  \\n*<span class="token operator">*</span>项目名称<span class="token operator">*</span><span class="token operator">*</span>：NOHI  \\n*<span class="token operator">*</span>Git log*<span class="token operator">*</span>: $<span class="token punctuation">{</span>GIT_LOG<span class="token punctuation">}</span>   \\n*<span class="token operator">*</span>构建分支<span class="token operator">*</span><span class="token operator">*</span>: $<span class="token punctuation">{</span>GIT_BRANCH<span class="token punctuation">}</span>  \\n*<span class="token operator">*</span>构建地址<span class="token operator">*</span><span class="token operator">*</span>：$<span class="token punctuation">{</span>RUN_DISPLAY_URL<span class="token punctuation">}</span>  \\n*<span class="token operator">*</span>构建任务<span class="token operator">*</span><span class="token operator">*</span>：$<span class="token punctuation">{</span>BUILD_TASKS<span class="token punctuation">}</span><span class="token string">&quot;
                        }
                    }&#39;
            &quot;</span><span class="token string">&quot;&quot;</span>
        <span class="token punctuation">}</span>
        always <span class="token punctuation">{</span> 
            <span class="token function">echo</span> <span class="token string">&#39;I will always say Hello again!&#39;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="演示3-通知gitlab构建状态" tabindex="-1"><a class="header-anchor" href="#演示3-通知gitlab构建状态" aria-hidden="true">#</a> 演示3：通知gitlab构建状态</h6><p>Jenkins端做了构建，可以通过gitlab通过的api将构建状态通知过去，作为开发人员发起Merge Request或者合并Merge Request的依据之一。</p><p><em>注意一定要指定gitLabConnection(&#39;gitlab&#39;)，不然没法认证到Gitlab端</em></p><p><code>jenkins/pipelines/p7.yaml</code></p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>pipeline <span class="token punctuation">{</span>
    agent <span class="token punctuation">{</span> label <span class="token string">&#39;k8s-worker2&#39;</span><span class="token punctuation">}</span>
    
    options <span class="token punctuation">{</span>
		buildDiscarder<span class="token punctuation">(</span>logRotator<span class="token punctuation">(</span>numToKeepStr: <span class="token string">&#39;10&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
		disableConcurrentBuilds<span class="token punctuation">(</span><span class="token punctuation">)</span>
		timeout<span class="token punctuation">(</span>time: 20<span class="token punctuation">,</span> unit: <span class="token string">&#39;MINUTES&#39;</span><span class="token punctuation">)</span>
		gitLabConnection<span class="token punctuation">(</span><span class="token string">&#39;gitlab&#39;</span><span class="token punctuation">)</span>
	<span class="token punctuation">}</span>

    environment <span class="token punctuation">{</span>
        IMAGE_REPO = <span class="token string">&quot;10.0.0.181:5000/demo/myblog&quot;</span>
        DINGTALK_CREDS = credentials<span class="token punctuation">(</span><span class="token string">&#39;dingTalk&#39;</span><span class="token punctuation">)</span>
        TAB_STR = <span class="token string">&quot;\\n                    \\n&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&quot;</span>
    <span class="token punctuation">}</span>

    stages <span class="token punctuation">{</span>
        stage<span class="token punctuation">(</span><span class="token string">&#39;printenv&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                script<span class="token punctuation">{</span>
                    sh <span class="token string">&quot;git log --oneline -n 1 &gt; gitlog.file&quot;</span>
                    env<span class="token punctuation">.</span>GIT_LOG = readFile<span class="token punctuation">(</span><span class="token string">&quot;gitlog.file&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span>trim<span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token punctuation">}</span>
                sh <span class="token string">&#39;printenv&#39;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        stage<span class="token punctuation">(</span><span class="token string">&#39;checkout&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                checkout scm
                updateGitlabCommitStatus<span class="token punctuation">(</span>name: env<span class="token punctuation">.</span>STAGE_NAME<span class="token punctuation">,</span> state: <span class="token string">&#39;success&#39;</span><span class="token punctuation">)</span>
                script<span class="token punctuation">{</span>
                    env<span class="token punctuation">.</span>BUILD_TASKS = env<span class="token punctuation">.</span>STAGE_NAME <span class="token operator">+</span> <span class="token string">&quot;√...&quot;</span> <span class="token operator">+</span> env<span class="token punctuation">.</span>TAB_STR
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        stage<span class="token punctuation">(</span><span class="token string">&#39;build-image&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                retry<span class="token punctuation">(</span>2<span class="token punctuation">)</span> <span class="token punctuation">{</span> sh <span class="token string">&#39;docker build . -t \${IMAGE_REPO}:\${GIT_COMMIT}&#39;</span><span class="token punctuation">}</span>
                updateGitlabCommitStatus<span class="token punctuation">(</span>name: env<span class="token punctuation">.</span>STAGE_NAME<span class="token punctuation">,</span> state: <span class="token string">&#39;success&#39;</span><span class="token punctuation">)</span>
                script<span class="token punctuation">{</span>
                    env<span class="token punctuation">.</span>BUILD_TASKS <span class="token operator">+=</span> env<span class="token punctuation">.</span>STAGE_NAME <span class="token operator">+</span> <span class="token string">&quot;√...&quot;</span> <span class="token operator">+</span> env<span class="token punctuation">.</span>TAB_STR
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        stage<span class="token punctuation">(</span><span class="token string">&#39;push-image&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                retry<span class="token punctuation">(</span>2<span class="token punctuation">)</span> <span class="token punctuation">{</span> sh <span class="token string">&#39;docker push \${IMAGE_REPO}:\${GIT_COMMIT}&#39;</span><span class="token punctuation">}</span>
                updateGitlabCommitStatus<span class="token punctuation">(</span>name: env<span class="token punctuation">.</span>STAGE_NAME<span class="token punctuation">,</span> state: <span class="token string">&#39;success&#39;</span><span class="token punctuation">)</span>
                script<span class="token punctuation">{</span>
                    env<span class="token punctuation">.</span>BUILD_TASKS <span class="token operator">+=</span> env<span class="token punctuation">.</span>STAGE_NAME <span class="token operator">+</span> <span class="token string">&quot;√...&quot;</span> <span class="token operator">+</span> env<span class="token punctuation">.</span>TAB_STR
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        stage<span class="token punctuation">(</span><span class="token string">&#39;deploy&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                sh <span class="token string">&quot;sed -i &#39;s#{{IMAGE_URL}}#\${IMAGE_REPO}:\${GIT_COMMIT}#g&#39; deploy/*&quot;</span>
                timeout<span class="token punctuation">(</span>time: 1<span class="token punctuation">,</span> unit: <span class="token string">&#39;MINUTES&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    sh <span class="token string">&quot;kubectl apply -f deploy/&quot;</span>
                <span class="token punctuation">}</span>
                updateGitlabCommitStatus<span class="token punctuation">(</span>name: env<span class="token punctuation">.</span>STAGE_NAME<span class="token punctuation">,</span> state: <span class="token string">&#39;success&#39;</span><span class="token punctuation">)</span>
                script<span class="token punctuation">{</span>
                    env<span class="token punctuation">.</span>BUILD_TASKS <span class="token operator">+=</span> env<span class="token punctuation">.</span>STAGE_NAME <span class="token operator">+</span> <span class="token string">&quot;√...&quot;</span> <span class="token operator">+</span> env<span class="token punctuation">.</span>TAB_STR
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    post <span class="token punctuation">{</span>
        success <span class="token punctuation">{</span> 
            <span class="token function">echo</span> <span class="token string">&#39;Congratulations!&#39;</span>
            sh <span class="token string">&quot;&quot;</span><span class="token string">&quot;
                curl &#39;https://oapi.dingtalk.com/robot/send?access_token=\${DINGTALK_CREDS_PSW}&#39; \\
                    -H &#39;Content-Type: application/json&#39; \\
                    -d &#39;{
                        &quot;</span>msgtype<span class="token string">&quot;: &quot;</span>markdown<span class="token string">&quot;,
                        &quot;</span>markdown<span class="token string">&quot;: {
                            &quot;</span>title<span class="token string">&quot;:&quot;</span>myblog<span class="token string">&quot;,
                            &quot;</span>text<span class="token string">&quot;: &quot;</span>😄👍 构建成功 👍😄  \\n*<span class="token operator">*</span>项目名称<span class="token operator">*</span><span class="token operator">*</span>：NOHI  \\n*<span class="token operator">*</span>Git log*<span class="token operator">*</span>: $<span class="token punctuation">{</span>GIT_LOG<span class="token punctuation">}</span>   \\n*<span class="token operator">*</span>构建分支<span class="token operator">*</span><span class="token operator">*</span>: $<span class="token punctuation">{</span>BRANCH_NAME<span class="token punctuation">}</span>   \\n*<span class="token operator">*</span>构建地址<span class="token operator">*</span><span class="token operator">*</span>：$<span class="token punctuation">{</span>RUN_DISPLAY_URL<span class="token punctuation">}</span>  \\n*<span class="token operator">*</span>构建任务<span class="token operator">*</span><span class="token operator">*</span>：$<span class="token punctuation">{</span>BUILD_TASKS<span class="token punctuation">}</span><span class="token string">&quot;
                        }
                    }&#39;
            &quot;</span><span class="token string">&quot;&quot;</span> 
        <span class="token punctuation">}</span>
        failure <span class="token punctuation">{</span>
            <span class="token function">echo</span> <span class="token string">&#39;Oh no!&#39;</span>
            sh <span class="token string">&quot;&quot;</span><span class="token string">&quot;
                curl &#39;https://oapi.dingtalk.com/robot/send?access_token=\${DINGTALK_CREDS_PSW}&#39; \\
                    -H &#39;Content-Type: application/json&#39; \\
                    -d &#39;{
                        &quot;</span>msgtype<span class="token string">&quot;: &quot;</span>markdown<span class="token string">&quot;,
                        &quot;</span>markdown<span class="token string">&quot;: {
                            &quot;</span>title<span class="token string">&quot;:&quot;</span>myblog<span class="token string">&quot;,
                            &quot;</span>text<span class="token string">&quot;: &quot;</span>😖❌ 构建失败 ❌😖  \\n*<span class="token operator">*</span>项目名称<span class="token operator">*</span><span class="token operator">*</span>：NOHI  \\n*<span class="token operator">*</span>Git log*<span class="token operator">*</span>: $<span class="token punctuation">{</span>GIT_LOG<span class="token punctuation">}</span>   \\n*<span class="token operator">*</span>构建分支<span class="token operator">*</span><span class="token operator">*</span>: $<span class="token punctuation">{</span>BRANCH_NAME<span class="token punctuation">}</span>  \\n*<span class="token operator">*</span>构建地址<span class="token operator">*</span><span class="token operator">*</span>：$<span class="token punctuation">{</span>RUN_DISPLAY_URL<span class="token punctuation">}</span>  \\n*<span class="token operator">*</span>构建任务<span class="token operator">*</span><span class="token operator">*</span>：$<span class="token punctuation">{</span>BUILD_TASKS<span class="token punctuation">}</span><span class="token string">&quot;
                        }
                    }&#39;
            &quot;</span><span class="token string">&quot;&quot;</span>
        <span class="token punctuation">}</span>
        always <span class="token punctuation">{</span> 
            <span class="token function">echo</span> <span class="token string">&#39;I will always say Hello again!&#39;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们可以访问gitlab，然后找到commit记录，查看同步状态</p><p><img src="`+T+'" alt=""></p><p>提交merge request，也可以查看到相关的任务状态，可以作为项目owner合并代码的依据之一：</p><p><img src="'+A+'" alt=""></p><h6 id="本章小节" tabindex="-1"><a class="header-anchor" href="#本章小节" aria-hidden="true">#</a> 本章小节</h6><p>优势:</p><ul><li>根据分支展示, 视图人性化</li><li>自动检测各分支的变更</li></ul><p>思考：</p><ul><li>Jenkins的slave端，没有任务的时候处于闲置状态，slave节点多的话造成资源浪费</li><li>是否可以利用kubernetes的Pod来启动slave，动态slave pod来执行构建任务</li></ul><blockquote></blockquote><h4 id="工具集成与jenkinsfile实践篇" tabindex="-1"><a class="header-anchor" href="#工具集成与jenkinsfile实践篇" aria-hidden="true">#</a> 工具集成与Jenkinsfile实践篇</h4><ol><li>Jenkins如何对接kubernetes集群</li><li>使用kubernetes的Pod-Template来作为动态的agent执行Jenkins任务</li><li>如何制作agent容器实现不同类型的业务的集成</li><li>集成代码扫描、docker镜像自动构建、k8s服务部署、自动化测试</li></ol><h5 id="集成kubernetes" tabindex="-1"><a class="header-anchor" href="#集成kubernetes" aria-hidden="true">#</a> 集成Kubernetes</h5><h6 id="插件安装及配置" tabindex="-1"><a class="header-anchor" href="#插件安装及配置" aria-hidden="true">#</a> 插件安装及配置</h6>',29),fn={href:"https://plugins.jenkins.io/kubernetes/",target:"_blank",rel:"noopener noreferrer"},wn=n("p",null,"[系统管理] -> [插件管理] -> [搜索kubernetes]->直接安装",-1),Sn={href:"https://plugins.jenkins.io/bouncycastle-api",target:"_blank",rel:"noopener noreferrer"},Tn=t("<li><p>[系统管理] -&gt; [系统配置] -&gt; [Add a new cloud]</p><blockquote><p>20230317 Jenkins2.395 菜单改为：系统管理-节点管理-Clouds- [Add a new cloud]</p></blockquote></li><li><p>配置地址信息</p><ul><li>Kubernetes 地址: https://kubernetes.default（或者https://10.0.0.181:6443）</li><li>Kubernetes 命名空间：jenkins</li><li>服务证书不用写（我们在安装Jenkins的时候已经指定过serviceAccount），均使用默认</li><li>连接测试，成功会提示：Connection test successful</li><li>Jenkins地址：http://jenkins:8080</li><li>Jenkins 通道 ：jenkins:50000</li></ul></li><li><p>配置Pod Template</p><ul><li>名称：jnlp-slave</li><li>命名空间：jenkins</li><li>标签列表：jnlp-slave，作为agent的label选择用</li><li>连接 Jenkins 的超时时间（秒） ：300，设置连接jenkins超时时间</li><li>节点选择器：agent=true</li><li>工作空间卷：选择hostpath，设置/opt/jenkins_jobs/,注意需要设置chown -R 1000:1000 /opt/jenkins_jobs/权限，否则Pod没有权限</li></ul></li>",3),An=t(`<h6 id="演示动态slave-pod" tabindex="-1"><a class="header-anchor" href="#演示动态slave-pod" aria-hidden="true">#</a> 演示动态slave pod</h6><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token comment"># 为准备运行jnlp-slave-agent的pod的节点打上label</span>
$ kubectl label node k8s-worker1 agent=true

<span class="token comment">### 回放一次多分支流水线develop分支</span>
agent <span class="token punctuation">{</span> label <span class="token string">&#39;jnlp-slave&#39;</span><span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>执行任务，会下载默认的jnlp-slave镜像，地址为jenkins/inbound-agent:4.3-4，我们可以先在k8s-master节点拉取下来该镜像：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ docker pull jenkins/inbound-agent:4<span class="token punctuation">.</span>3-4
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>保存jenkinsfile提交后，会出现报错，因为我们的agent已经不再是宿主机，而是Pod中的容器内，报错如下：</p><p><img src="`+j+`" alt=""></p><p>因此我们需要将用到的命令行工具集成到Pod的容器内，但是思考如下问题：</p><ul><li>目前是用的jnlp的容器，是java的环境，我们在此基础上需要集成很多工具，能不能创建一个新的容器，让新容器来做具体的任务，jnlp-slave容器只用来负责连接jenkins-master</li><li>针对不同的构建环境（java、python、go、nodejs），可以制作不同的容器，来执行对应的任务</li></ul><blockquote></blockquote><h6 id="pod-template中容器镜像的制作" tabindex="-1"><a class="header-anchor" href="#pod-template中容器镜像的制作" aria-hidden="true">#</a> Pod-Template中容器镜像的制作</h6><p>为解决上述问题，我们制作一个tools镜像，集成常用的工具，来完成常见的构建任务，需要注意的几点：</p><ul><li>使用alpine基础镜像，自身体积比较小</li><li>替换国内安装源</li><li>为了使用docker，安装了docker</li><li>为了克隆代码，安装git</li><li>为了后续做python的测试等任务，安装python环境</li><li>为了在容器中调用kubectl的命令，拷贝了kubectl的二进制文件</li><li>为了认证kubectl，需要在容器内部生成.kube目录及config文件</li></ul><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ mkdir tools<span class="token punctuation">;</span>
$ cd tools<span class="token punctuation">;</span>
$ <span class="token function">cp</span> \`which kubectl\` <span class="token punctuation">.</span>
$ <span class="token function">cp</span> ~<span class="token operator">/</span><span class="token punctuation">.</span>kube/config <span class="token punctuation">.</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><em>Dockerfile</em></p><p><code>jenkins/custom-images/tools/Dockerfile</code></p><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code><span class="token instruction"><span class="token keyword">FROM</span> alpine</span>
<span class="token instruction"><span class="token keyword">LABEL</span> maintainer=<span class="token string">&quot;thisisnohi@163.com&quot;</span></span>
<span class="token instruction"><span class="token keyword">USER</span> root</span>

<span class="token instruction"><span class="token keyword">RUN</span> sed -i <span class="token string">&#39;s/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g&#39;</span> /etc/apk/repositories &amp;&amp; <span class="token operator">\\</span>
    apk update &amp;&amp; <span class="token operator">\\</span>
    apk add  --no-cache openrc docker git curl tar gcc g++ make <span class="token operator">\\</span>
    python2 python2-dev py-pip python3-dev bash shadow openjdk8 openjdk11 openssl-dev libffi-dev <span class="token operator">\\</span>
    libstdc++ harfbuzz nss freetype ttf-freefont &amp;&amp; <span class="token operator">\\</span>
    mkdir -p /root/.kube &amp;&amp; <span class="token operator">\\</span>
    usermod -a -G docker root</span>

<span class="token instruction"><span class="token keyword">COPY</span> config /root/.kube/</span>

<span class="token instruction"><span class="token keyword">RUN</span> rm -rf /var/cache/apk/* </span>
<span class="token comment">#-----------------安装 kubectl--------------------#</span>
<span class="token instruction"><span class="token keyword">COPY</span> kubectl /usr/local/bin/</span>
<span class="token instruction"><span class="token keyword">RUN</span> chmod +x /usr/local/bin/kubectl</span>
<span class="token comment"># ------------------------------------------------#</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>执行镜像构建并推送到仓库中：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ docker build <span class="token punctuation">.</span> <span class="token operator">-</span>t 10<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>181:5000/devops/tools:v1
$ docker push 10<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>181:5000/devops/tools:v1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>我们可以直接使用该镜像做测试：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token comment">## 启动临时镜像做测试</span>
$ docker run <span class="token operator">--</span><span class="token function">rm</span> <span class="token operator">-</span>ti 10<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>181:5000/devops/tools:v1 bash
<span class="token comment"># / git clone http://xxxxxx.git</span>
<span class="token comment"># / kubectl get no</span>
<span class="token comment"># / python3</span>
<span class="token comment">#/ docker</span>

<span class="token comment">## 重新挂载docker的sock文件</span>
docker run <span class="token operator">-</span>v <span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>run/docker<span class="token punctuation">.</span>sock:<span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>run/docker<span class="token punctuation">.</span>sock <span class="token operator">--</span><span class="token function">rm</span> <span class="token operator">-</span>ti 10<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>181:5000/devops/tools:v1 bash
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="实践通过jenkinsfile实现demo项目自动发布到kubenetes环境" tabindex="-1"><a class="header-anchor" href="#实践通过jenkinsfile实现demo项目自动发布到kubenetes环境" aria-hidden="true">#</a> 实践通过Jenkinsfile实现demo项目自动发布到kubenetes环境</h6><p>更新Jenkins中的PodTemplate，添加tools镜像，注意同时要先添加名为jnlp的container，因为我们是使用自定义的PodTemplate覆盖掉默认的模板：</p><p><img src="`+E+'" alt=""></p><p>在卷栏目，添加卷，Host Path Volume，不然在容器中使用docker会提示docker服务未启动</p><p><img src="'+I+`" alt=""></p><p>tools容器做好后，我们需要对Jenkinsfile做如下调整：</p><p><code>jenkins/pipelines/p8.yaml</code></p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>pipeline <span class="token punctuation">{</span>
    agent <span class="token punctuation">{</span> label <span class="token string">&#39;jnlp-slave&#39;</span><span class="token punctuation">}</span>
    
    options <span class="token punctuation">{</span>
		buildDiscarder<span class="token punctuation">(</span>logRotator<span class="token punctuation">(</span>numToKeepStr: <span class="token string">&#39;10&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
		disableConcurrentBuilds<span class="token punctuation">(</span><span class="token punctuation">)</span>
		timeout<span class="token punctuation">(</span>time: 20<span class="token punctuation">,</span> unit: <span class="token string">&#39;MINUTES&#39;</span><span class="token punctuation">)</span>
		gitLabConnection<span class="token punctuation">(</span><span class="token string">&#39;gitlab&#39;</span><span class="token punctuation">)</span>
	<span class="token punctuation">}</span>

    environment <span class="token punctuation">{</span>
        IMAGE_REPO = <span class="token string">&quot;10.0.0.181:5000/myblog&quot;</span>
        DINGTALK_CREDS = credentials<span class="token punctuation">(</span><span class="token string">&#39;dingTalk&#39;</span><span class="token punctuation">)</span>
        TAB_STR = <span class="token string">&quot;\\n                    \\n&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&quot;</span>
    <span class="token punctuation">}</span>

    stages <span class="token punctuation">{</span>
        stage<span class="token punctuation">(</span><span class="token string">&#39;printenv&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                script<span class="token punctuation">{</span>
                    sh <span class="token string">&quot;git log --oneline -n 1 &gt; gitlog.file&quot;</span>
                    env<span class="token punctuation">.</span>GIT_LOG = readFile<span class="token punctuation">(</span><span class="token string">&quot;gitlog.file&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span>trim<span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token punctuation">}</span>
                sh <span class="token string">&#39;printenv&#39;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        stage<span class="token punctuation">(</span><span class="token string">&#39;checkout&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                container<span class="token punctuation">(</span><span class="token string">&#39;tools&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    checkout scm
                <span class="token punctuation">}</span>
                updateGitlabCommitStatus<span class="token punctuation">(</span>name: env<span class="token punctuation">.</span>STAGE_NAME<span class="token punctuation">,</span> state: <span class="token string">&#39;success&#39;</span><span class="token punctuation">)</span>
                script<span class="token punctuation">{</span>
                    env<span class="token punctuation">.</span>BUILD_TASKS = env<span class="token punctuation">.</span>STAGE_NAME <span class="token operator">+</span> <span class="token string">&quot;√...&quot;</span> <span class="token operator">+</span> env<span class="token punctuation">.</span>TAB_STR
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        stage<span class="token punctuation">(</span><span class="token string">&#39;build-image&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                container<span class="token punctuation">(</span><span class="token string">&#39;tools&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    retry<span class="token punctuation">(</span>2<span class="token punctuation">)</span> <span class="token punctuation">{</span> sh <span class="token string">&#39;docker build . -t \${IMAGE_REPO}:\${GIT_COMMIT}&#39;</span><span class="token punctuation">}</span>
                <span class="token punctuation">}</span>
                updateGitlabCommitStatus<span class="token punctuation">(</span>name: env<span class="token punctuation">.</span>STAGE_NAME<span class="token punctuation">,</span> state: <span class="token string">&#39;success&#39;</span><span class="token punctuation">)</span>
                script<span class="token punctuation">{</span>
                    env<span class="token punctuation">.</span>BUILD_TASKS <span class="token operator">+=</span> env<span class="token punctuation">.</span>STAGE_NAME <span class="token operator">+</span> <span class="token string">&quot;√...&quot;</span> <span class="token operator">+</span> env<span class="token punctuation">.</span>TAB_STR
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        stage<span class="token punctuation">(</span><span class="token string">&#39;push-image&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                container<span class="token punctuation">(</span><span class="token string">&#39;tools&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    retry<span class="token punctuation">(</span>2<span class="token punctuation">)</span> <span class="token punctuation">{</span> sh <span class="token string">&#39;docker push \${IMAGE_REPO}:\${GIT_COMMIT}&#39;</span><span class="token punctuation">}</span>
                <span class="token punctuation">}</span>
                updateGitlabCommitStatus<span class="token punctuation">(</span>name: env<span class="token punctuation">.</span>STAGE_NAME<span class="token punctuation">,</span> state: <span class="token string">&#39;success&#39;</span><span class="token punctuation">)</span>
                script<span class="token punctuation">{</span>
                    env<span class="token punctuation">.</span>BUILD_TASKS <span class="token operator">+=</span> env<span class="token punctuation">.</span>STAGE_NAME <span class="token operator">+</span> <span class="token string">&quot;√...&quot;</span> <span class="token operator">+</span> env<span class="token punctuation">.</span>TAB_STR
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        stage<span class="token punctuation">(</span><span class="token string">&#39;deploy&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                container<span class="token punctuation">(</span><span class="token string">&#39;tools&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    sh <span class="token string">&quot;sed -i &#39;s#{{IMAGE_URL}}#\${IMAGE_REPO}:\${GIT_COMMIT}#g&#39; deploy/*&quot;</span>
                    timeout<span class="token punctuation">(</span>time: 1<span class="token punctuation">,</span> unit: <span class="token string">&#39;MINUTES&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                        sh <span class="token string">&quot;kubectl apply -f deploy/&quot;</span>
                    <span class="token punctuation">}</span>
                <span class="token punctuation">}</span>
                updateGitlabCommitStatus<span class="token punctuation">(</span>name: env<span class="token punctuation">.</span>STAGE_NAME<span class="token punctuation">,</span> state: <span class="token string">&#39;success&#39;</span><span class="token punctuation">)</span>
                script<span class="token punctuation">{</span>
                    env<span class="token punctuation">.</span>BUILD_TASKS <span class="token operator">+=</span> env<span class="token punctuation">.</span>STAGE_NAME <span class="token operator">+</span> <span class="token string">&quot;√...&quot;</span> <span class="token operator">+</span> env<span class="token punctuation">.</span>TAB_STR
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    post <span class="token punctuation">{</span>
        success <span class="token punctuation">{</span> 
            <span class="token function">echo</span> <span class="token string">&#39;Congratulations!&#39;</span>
            sh <span class="token string">&quot;&quot;</span><span class="token string">&quot;
                curl &#39;https://oapi.dingtalk.com/robot/send?access_token=\${DINGTALK_CREDS_PSW}&#39; \\
                    -H &#39;Content-Type: application/json&#39; \\
                    -d &#39;{
                        &quot;</span>msgtype<span class="token string">&quot;: &quot;</span>markdown<span class="token string">&quot;,
                        &quot;</span>markdown<span class="token string">&quot;: {
                            &quot;</span>title<span class="token string">&quot;:&quot;</span>myblog<span class="token string">&quot;,
                            &quot;</span>text<span class="token string">&quot;: &quot;</span>😄👍 构建成功 👍😄  \\n*<span class="token operator">*</span>项目名称<span class="token operator">*</span><span class="token operator">*</span>：nohi  \\n*<span class="token operator">*</span>Git log*<span class="token operator">*</span>: $<span class="token punctuation">{</span>GIT_LOG<span class="token punctuation">}</span>   \\n*<span class="token operator">*</span>构建分支<span class="token operator">*</span><span class="token operator">*</span>: $<span class="token punctuation">{</span>BRANCH_NAME<span class="token punctuation">}</span>   \\n*<span class="token operator">*</span>构建地址<span class="token operator">*</span><span class="token operator">*</span>：$<span class="token punctuation">{</span>RUN_DISPLAY_URL<span class="token punctuation">}</span>  \\n*<span class="token operator">*</span>构建任务<span class="token operator">*</span><span class="token operator">*</span>：$<span class="token punctuation">{</span>BUILD_TASKS<span class="token punctuation">}</span><span class="token string">&quot;
                        }
                    }&#39;
            &quot;</span><span class="token string">&quot;&quot;</span> 
        <span class="token punctuation">}</span>
        failure <span class="token punctuation">{</span>
            <span class="token function">echo</span> <span class="token string">&#39;Oh no!&#39;</span>
            sh <span class="token string">&quot;&quot;</span><span class="token string">&quot;
                curl &#39;https://oapi.dingtalk.com/robot/send?access_token=\${DINGTALK_CREDS_PSW}&#39; \\
                    -H &#39;Content-Type: application/json&#39; \\
                    -d &#39;{
                        &quot;</span>msgtype<span class="token string">&quot;: &quot;</span>markdown<span class="token string">&quot;,
                        &quot;</span>markdown<span class="token string">&quot;: {
                            &quot;</span>title<span class="token string">&quot;:&quot;</span>myblog<span class="token string">&quot;,
                            &quot;</span>text<span class="token string">&quot;: &quot;</span>😖❌ 构建失败 ❌😖  \\n*<span class="token operator">*</span>项目名称<span class="token operator">*</span><span class="token operator">*</span>：nohi  \\n*<span class="token operator">*</span>Git log*<span class="token operator">*</span>: $<span class="token punctuation">{</span>GIT_LOG<span class="token punctuation">}</span>   \\n*<span class="token operator">*</span>构建分支<span class="token operator">*</span><span class="token operator">*</span>: $<span class="token punctuation">{</span>BRANCH_NAME<span class="token punctuation">}</span>  \\n*<span class="token operator">*</span>构建地址<span class="token operator">*</span><span class="token operator">*</span>：$<span class="token punctuation">{</span>RUN_DISPLAY_URL<span class="token punctuation">}</span>  \\n*<span class="token operator">*</span>构建任务<span class="token operator">*</span><span class="token operator">*</span>：$<span class="token punctuation">{</span>BUILD_TASKS<span class="token punctuation">}</span><span class="token string">&quot;
                        }
                    }&#39;
            &quot;</span><span class="token string">&quot;&quot;</span>
        <span class="token punctuation">}</span>
        always <span class="token punctuation">{</span> 
            <span class="token function">echo</span> <span class="token string">&#39;I will always say Hello again!&#39;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote></blockquote><h5 id="集成sonarqube实现代码扫描" tabindex="-1"><a class="header-anchor" href="#集成sonarqube实现代码扫描" aria-hidden="true">#</a> 集成sonarQube实现代码扫描</h5><p>Sonar可以从以下七个维度检测代码质量，而作为开发人员至少需要处理前5种代码质量问题。</p><ol><li>不遵循代码标准 sonar可以通过PMD,CheckStyle,Findbugs等等代码规则检测工具规范代码编写。</li><li>潜在的缺陷 sonar可以通过PMD,CheckStyle,Findbugs等等代码规则检测工具检 测出潜在的缺陷。</li><li>糟糕的复杂度分布 文件、类、方法等，如果复杂度过高将难以改变，这会使得开发人员 难以理解它们, 且如果没有自动化的单元测试，对于程序中的任何组件的改变都将可能导致需要全面的回归测试。</li><li>重复 显然程序中包含大量复制粘贴的代码是质量低下的，sonar可以展示 源码中重复严重的地方。</li><li>注释不足或者过多 没有注释将使代码可读性变差，特别是当不可避免地出现人员变动 时，程序的可读性将大幅下降 而过多的注释又会使得开发人员将精力过多地花费在阅读注释上，亦违背初衷。</li><li>缺乏单元测试 sonar可以很方便地统计并展示单元测试覆盖率。</li><li>糟糕的设计 通过sonar可以找出循环，展示包与包、类与类之间的相互依赖关系，可以检测自定义的架构规则 通过sonar可以管理第三方的jar包，可以利用LCOM4检测单个任务规则的应用情况， 检测耦合。</li></ol><h6 id="sonarqube架构简介" tabindex="-1"><a class="header-anchor" href="#sonarqube架构简介" aria-hidden="true">#</a> sonarqube架构简介</h6><p><img src="`+x+`" alt=""></p><ol><li>CS架构 <ul><li>sonarqube scanner</li><li>sonarqube server</li></ul></li><li>SonarQube Scanner 扫描仪在本地执行代码扫描任务</li><li>执行完后，将分析报告被发送到SonarQube服务器进行处理</li><li>SonarQube服务器处理和存储分析报告导致SonarQube数据库，并显示结果在UI中</li></ol><h6 id="sonarqube-on-kubernetes环境搭建" tabindex="-1"><a class="header-anchor" href="#sonarqube-on-kubernetes环境搭建" aria-hidden="true">#</a> sonarqube on kubernetes环境搭建</h6><ol><li>资源文件准备</li></ol><p><code>sonar/sonar.yaml</code></p><ul><li>和gitlab共享postgres数据库</li><li>使用ingress地址 <code>sonar.nohi.com</code> 进行访问</li><li>使用initContainers进行系统参数调整</li></ul><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> sonarqube
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> jenkins
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> sonarqube
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> sonarqube
    <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">9000</span>
    <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">9000</span>
    <span class="token key atrule">protocol</span><span class="token punctuation">:</span> TCP
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> sonarqube
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> jenkins
  <span class="token key atrule">name</span><span class="token punctuation">:</span> sonarqube
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> sonarqube
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">1</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> sonarqube
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">labels</span><span class="token punctuation">:</span>
        <span class="token key atrule">app</span><span class="token punctuation">:</span> sonarqube
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token comment"># 去除nodeselecttor</span>
      <span class="token comment">#nodeSelector:</span>
      <span class="token comment">#  sonar: &quot;true&quot;</span>
      <span class="token key atrule">dnsConfig</span><span class="token punctuation">:</span>
         <span class="token key atrule">options</span><span class="token punctuation">:</span>
          <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> ndots
            <span class="token key atrule">value</span><span class="token punctuation">:</span> <span class="token string">&quot;2&quot;</span>
      <span class="token key atrule">initContainers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">command</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> /sbin/sysctl
        <span class="token punctuation">-</span> <span class="token punctuation">-</span>w
        <span class="token punctuation">-</span> vm.max_map_count=262144
        <span class="token key atrule">image</span><span class="token punctuation">:</span> alpine<span class="token punctuation">:</span><span class="token number">3.6</span>
        <span class="token key atrule">imagePullPolicy</span><span class="token punctuation">:</span> IfNotPresent
        <span class="token key atrule">name</span><span class="token punctuation">:</span> elasticsearch<span class="token punctuation">-</span>logging<span class="token punctuation">-</span>init
        <span class="token key atrule">resources</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
        <span class="token key atrule">securityContext</span><span class="token punctuation">:</span>
          <span class="token key atrule">privileged</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> sonarqube
        <span class="token comment"># 20230318 使用9.8.0-community版本</span>
        <span class="token comment">#image: sonarqube:7.9-community</span>
        <span class="token key atrule">image</span><span class="token punctuation">:</span> sonarqube<span class="token punctuation">:</span>9.8.0<span class="token punctuation">-</span>community
        <span class="token key atrule">ports</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">9000</span>
        <span class="token key atrule">env</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> SONARQUBE_JDBC_USERNAME
          <span class="token key atrule">valueFrom</span><span class="token punctuation">:</span>
            <span class="token key atrule">secretKeyRef</span><span class="token punctuation">:</span>
              <span class="token key atrule">name</span><span class="token punctuation">:</span> gitlab<span class="token punctuation">-</span>secret
              <span class="token key atrule">key</span><span class="token punctuation">:</span> postgres.user.root
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> SONARQUBE_JDBC_PASSWORD
          <span class="token key atrule">valueFrom</span><span class="token punctuation">:</span>
            <span class="token key atrule">secretKeyRef</span><span class="token punctuation">:</span>
              <span class="token key atrule">name</span><span class="token punctuation">:</span> gitlab<span class="token punctuation">-</span>secret
              <span class="token key atrule">key</span><span class="token punctuation">:</span> postgres.pwd.root
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> SONARQUBE_JDBC_URL
          <span class="token key atrule">value</span><span class="token punctuation">:</span> <span class="token string">&quot;jdbc:postgresql://postgres:5432/sonar&quot;</span>
        <span class="token key atrule">livenessProbe</span><span class="token punctuation">:</span>
          <span class="token key atrule">httpGet</span><span class="token punctuation">:</span>
            <span class="token key atrule">path</span><span class="token punctuation">:</span> /sessions/new
            <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">9000</span>
          <span class="token key atrule">initialDelaySeconds</span><span class="token punctuation">:</span> <span class="token number">60</span>
          <span class="token key atrule">periodSeconds</span><span class="token punctuation">:</span> <span class="token number">30</span>
        <span class="token key atrule">readinessProbe</span><span class="token punctuation">:</span>
          <span class="token key atrule">httpGet</span><span class="token punctuation">:</span>
            <span class="token key atrule">path</span><span class="token punctuation">:</span> /sessions/new
            <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">9000</span>
          <span class="token key atrule">initialDelaySeconds</span><span class="token punctuation">:</span> <span class="token number">60</span>
          <span class="token key atrule">periodSeconds</span><span class="token punctuation">:</span> <span class="token number">30</span>
          <span class="token key atrule">failureThreshold</span><span class="token punctuation">:</span> <span class="token number">6</span>
        <span class="token key atrule">resources</span><span class="token punctuation">:</span>
          <span class="token key atrule">limits</span><span class="token punctuation">:</span>
            <span class="token key atrule">cpu</span><span class="token punctuation">:</span> 2000m
            <span class="token key atrule">memory</span><span class="token punctuation">:</span> 4096Mi
          <span class="token key atrule">requests</span><span class="token punctuation">:</span>
            <span class="token key atrule">cpu</span><span class="token punctuation">:</span> 300m
            <span class="token key atrule">memory</span><span class="token punctuation">:</span> 512Mi
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> networking.k8s.io/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Ingress
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> sonarqube
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> jenkins
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">rules</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> sonar.nohi.com
    <span class="token key atrule">http</span><span class="token punctuation">:</span>
      <span class="token key atrule">paths</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">path</span><span class="token punctuation">:</span> /
        <span class="token key atrule">pathType</span><span class="token punctuation">:</span> Prefix
        <span class="token key atrule">backend</span><span class="token punctuation">:</span>
          <span class="token key atrule">service</span><span class="token punctuation">:</span>
            <span class="token key atrule">name</span><span class="token punctuation">:</span> sonarqube
            <span class="token key atrule">port</span><span class="token punctuation">:</span>
              <span class="token key atrule">number</span><span class="token punctuation">:</span> <span class="token number">9000</span>
<span class="token key atrule">status</span><span class="token punctuation">:</span>
  <span class="token key atrule">loadBalancer</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li><p>sonarqube服务端安装</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>
<span class="token comment"># 创建sonar数据库</span>
$ kubectl <span class="token operator">-</span>n jenkins exec <span class="token operator">-</span>ti postgres-5859dc6f58-mgqz9 <span class="token operator">--</span> bash
<span class="token comment">#/ psql </span>
<span class="token comment"># create database sonar;</span>

<span class="token comment">## 创建sonarqube服务器</span>
$ kubectl create <span class="token operator">-</span>f sonar<span class="token punctuation">.</span>yaml

<span class="token comment">## 配置本地hosts解析</span>
10<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>181 sonar<span class="token punctuation">.</span>nohi<span class="token punctuation">.</span>com

<span class="token comment">## 访问sonarqube，初始用户名密码为 admin/admin</span>
$ curl http:<span class="token operator">/</span><span class="token operator">/</span>sonar<span class="token punctuation">.</span>nohi<span class="token punctuation">.</span>com
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>sonar-scanner的安装</p><p>下载地址： https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.2.0.1873-linux.zip。该地址比较慢，可以在网盘下载（https://pan.baidu.com/s/1SiEhWyHikTiKl5lEMX1tJg 提取码: tqb9）。</p><blockquote><p>20230318 下载最新版本： https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.8.0.2856-linux.zip</p><p>解压后操作</p></blockquote></li><li><p>演示sonar代码扫描功能</p><ul><li><p>在项目根目录中准备配置文件 <strong>sonar-project.properties</strong></p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>sonar<span class="token punctuation">.</span>projectKey=myblog
sonar<span class="token punctuation">.</span>projectName=myblog
<span class="token comment"># if you want disabled the DTD verification for a proxy problem for example, true by default</span>
sonar<span class="token punctuation">.</span>coverage<span class="token punctuation">.</span>dtdVerification=false
<span class="token comment"># JUnit like test report, default value is test.xml</span>
sonar<span class="token punctuation">.</span>sources=blog<span class="token punctuation">,</span>myblog
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>配置sonarqube服务器地址</p><p>由于sonar-scanner需要将扫描结果上报给sonarqube服务器做质量分析，因此我们需要在sonar-scanner中配置sonarqube的服务器地址：</p><p>在集群宿主机中测试，先配置一下hosts文件，然后配置sonar的地址：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ <span class="token function">cat</span> <span class="token operator">/</span>etc/hosts
10<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>181  sonar<span class="token punctuation">.</span>nohi<span class="token punctuation">.</span>com

$ <span class="token function">cat</span> sonar/sonar-scanner-4<span class="token punctuation">.</span>8<span class="token punctuation">.</span>0<span class="token punctuation">.</span>2856-linux/conf/sonar-scanner<span class="token punctuation">.</span>properties
<span class="token comment">#----- Default SonarQube server</span>
<span class="token comment">#sonar.host.url=http://localhost:9000</span>
sonar<span class="token punctuation">.</span>host<span class="token punctuation">.</span>url=http:<span class="token operator">/</span><span class="token operator">/</span>sonar<span class="token punctuation">.</span>nohi<span class="token punctuation">.</span>com
<span class="token comment">#----- Default source code encoding</span>
<span class="token comment">#sonar.sourceEncoding=UTF-8</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul></li></ol><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>- 为了使所有的pod都可以通过\`sonar.nohi.com\`访问，可以配置coredns的静态解析
- kubectl -n kube-system edit cm coredns -o yaml
hosts {
10.0.0.181 jenkins.nohi.com gitlab.nohi.com sonar.nohi.com
fallthrough
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><p>执行扫描</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token comment">## 在项目的根目录下执行 sonar目录需要修改</span>
$ sonar目录<span class="token operator">/</span>sonar-scanner-4<span class="token punctuation">.</span>8<span class="token punctuation">.</span>0<span class="token punctuation">.</span>2856-linux/bin/sonar-scanner  <span class="token operator">-</span>X 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>sonarqube界面查看结果</p><p>登录sonarqube界面查看结果，Quality Gates说明</p></li></ul><h6 id="插件安装及配置-1" tabindex="-1"><a class="header-anchor" href="#插件安装及配置-1" aria-hidden="true">#</a> 插件安装及配置</h6><ol><li><p>集成到tools容器中</p><p>由于我们的代码拉取、构建任务均是在tools容器中进行，因此我们需要把scanner集成到我们的tools容器中，又因为scanner是一个cli客户端，因此我们直接把包解压好，拷贝到tools容器内部，配置一下PATH路径即可，注意两点：</p><ul><li><p>直接在在tools镜像中配置<code>http://sonar.nohi.com</code></p></li><li><p>由于tools已经集成了java环境，因此可以直接剔除scanner自带的jre</p><ul><li><p>删掉sonar-scanner/jre目录</p></li><li><p>修改sonar-scanner/bin/sonar-scanner</p><p><code>use_embedded_jre=false</code></p></li></ul></li></ul><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ cd tools
$ <span class="token function">cp</span> <span class="token operator">-</span>r sonar目录<span class="token operator">/</span>sonar-scanner-4<span class="token punctuation">.</span>8<span class="token punctuation">.</span>0<span class="token punctuation">.</span>2856-linux/ sonar-scanner
<span class="token comment">## sonar配置，由于我们是在Pod中使用，也可以直接配置：sonar.host.url=http://sonarqube:9000</span>
$ <span class="token function">cat</span> sonar-scanner/conf/sonar-scanner<span class="token punctuation">.</span>properties
<span class="token comment">#----- Default SonarQube server</span>
sonar<span class="token punctuation">.</span>host<span class="token punctuation">.</span>url=http:<span class="token operator">/</span><span class="token operator">/</span>sonar<span class="token punctuation">.</span>nohi<span class="token punctuation">.</span>com

<span class="token comment">#----- Default source code encoding</span>
<span class="token comment">#sonar.sourceEncoding=UTF-8</span>

$ <span class="token function">rm</span> <span class="token operator">-</span>rf sonar-scanner/jre
$ vi sonar-scanner/bin/sonar-scanner
<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
use_embedded_jre=false
<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><em>Dockerfile</em></p><p><code>jenkins/custom-images/tools/Dockerfile2</code></p><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code><span class="token instruction"><span class="token keyword">FROM</span> alpine</span>
<span class="token instruction"><span class="token keyword">LABEL</span> maintainer=<span class="token string">&quot;thisisnohi@163.com&quot;</span></span>
<span class="token instruction"><span class="token keyword">USER</span> root</span>

<span class="token instruction"><span class="token keyword">RUN</span> sed -i <span class="token string">&#39;s/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g&#39;</span> /etc/apk/repositories &amp;&amp; <span class="token operator">\\</span>
    apk update &amp;&amp; <span class="token operator">\\</span>
    apk add  --no-cache openrc docker git curl tar gcc g++ make <span class="token operator">\\</span>
    bash shadow openjdk8 openjdk11 python3 py-pip python3-dev openssl-dev libffi-dev <span class="token operator">\\</span>
    libstdc++ harfbuzz nss freetype ttf-freefont &amp;&amp; <span class="token operator">\\</span>
    mkdir -p /root/.kube &amp;&amp; <span class="token operator">\\</span>
    usermod -a -G docker root</span>

<span class="token instruction"><span class="token keyword">COPY</span> config /root/.kube/</span>


<span class="token instruction"><span class="token keyword">RUN</span> rm -rf /var/cache/apk/*</span>

<span class="token comment">#-----------------安装 kubectl--------------------#</span>
<span class="token instruction"><span class="token keyword">COPY</span> kubectl /usr/local/bin/</span>
<span class="token instruction"><span class="token keyword">RUN</span> chmod +x /usr/local/bin/kubectl</span>
<span class="token comment"># ------------------------------------------------#</span>

<span class="token comment">#---------------安装 sonar-scanner-----------------#</span>
<span class="token instruction"><span class="token keyword">COPY</span> sonar-scanner /usr/lib/sonar-scanner</span>
<span class="token instruction"><span class="token keyword">RUN</span> ln -s /usr/lib/sonar-scanner/bin/sonar-scanner /usr/local/bin/sonar-scanner &amp;&amp; chmod +x /usr/local/bin/sonar-scanner</span>
<span class="token instruction"><span class="token keyword">ENV</span> SONAR_RUNNER_HOME=/usr/lib/sonar-scanner</span>
<span class="token comment"># ------------------------------------------------#</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><p>重新构建镜像，并推送到仓库：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>   $ docker build <span class="token punctuation">.</span> <span class="token operator">-</span>t 10<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>181:5000/devops/tools:v2
   $ docker push 10<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>181:5000/devops/tools:v2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li><p>修改Jenkins PodTemplate</p><p>为了在新的构建任务中可以拉取v2版本的tools镜像，需要更新PodTemplate</p></li><li><p>安装并配置sonar插件</p><p>由于sonarqube的扫描的结果需要进行Quality Gates的检测，那么我们在容器中执行完代码扫描任务后，如何知道本次扫描是否通过了Quality Gates，那么就需要借助于sonarqube实现的jenkins的插件。</p><ul><li><p>安装插件</p><p>插件中心搜索sonarqube，直接安装</p></li><li><p>配置插件</p><p>系统管理-&gt;系统配置-&gt; <strong>SonarQube servers</strong> -&gt;Add SonarQube</p><ul><li><p>Name：sonarqube</p></li><li><p>Server URL：http://sonar.nohi.com</p></li><li><p>Server authentication token</p><p>① 登录sonarqube -&gt; My Account -&gt; Security -&gt; Generate Token</p><p>② 登录Jenkins，添加全局凭据，类型为Secret text</p></li></ul></li><li><p>如何在jenkinsfile中使用</p><p>我们在 https://jenkins.io/doc/pipeline/steps/sonar/ 官方介绍中可以看到：</p></li></ul></li></ol><h6 id="jenkinsfile集成sonarqube演示" tabindex="-1"><a class="header-anchor" href="#jenkinsfile集成sonarqube演示" aria-hidden="true">#</a> Jenkinsfile集成sonarqube演示</h6><p><code>jenkins/pipelines/p9.yaml</code></p><div class="language-groovy line-numbers-mode" data-ext="groovy"><pre class="language-groovy"><code>pipeline <span class="token punctuation">{</span>
    agent <span class="token punctuation">{</span> label <span class="token string">&#39;jnlp-slave&#39;</span><span class="token punctuation">}</span>
    
    options <span class="token punctuation">{</span>
		<span class="token function">buildDiscarder</span><span class="token punctuation">(</span><span class="token function">logRotator</span><span class="token punctuation">(</span>numToKeepStr<span class="token punctuation">:</span> <span class="token string">&#39;10&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
		<span class="token function">disableConcurrentBuilds</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
		<span class="token function">timeout</span><span class="token punctuation">(</span>time<span class="token punctuation">:</span> <span class="token number">20</span><span class="token punctuation">,</span> unit<span class="token punctuation">:</span> <span class="token string">&#39;MINUTES&#39;</span><span class="token punctuation">)</span>
		<span class="token function">gitLabConnection</span><span class="token punctuation">(</span><span class="token string">&#39;gitlab&#39;</span><span class="token punctuation">)</span>
	<span class="token punctuation">}</span>

    environment <span class="token punctuation">{</span>
        IMAGE_REPO <span class="token operator">=</span> <span class="token interpolation-string"><span class="token string">&quot;10.0.0.181:5000/myblog&quot;</span></span>
        DINGTALK_CREDS <span class="token operator">=</span> <span class="token function">credentials</span><span class="token punctuation">(</span><span class="token string">&#39;dingTalk&#39;</span><span class="token punctuation">)</span>
        TAB_STR <span class="token operator">=</span> <span class="token interpolation-string"><span class="token string">&quot;\\n                    \\n&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&quot;</span></span>
    <span class="token punctuation">}</span>

    stages <span class="token punctuation">{</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">&#39;git-log&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                script<span class="token punctuation">{</span>
                    sh <span class="token interpolation-string"><span class="token string">&quot;git log --oneline -n 1 &gt; gitlog.file&quot;</span></span>
                    env<span class="token punctuation">.</span>GIT_LOG <span class="token operator">=</span> <span class="token function">readFile</span><span class="token punctuation">(</span><span class="token interpolation-string"><span class="token string">&quot;gitlog.file&quot;</span></span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">trim</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token punctuation">}</span>
                sh <span class="token string">&#39;printenv&#39;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>        
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">&#39;checkout&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                <span class="token function">container</span><span class="token punctuation">(</span><span class="token string">&#39;tools&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    checkout scm
                <span class="token punctuation">}</span>
                <span class="token function">updateGitlabCommitStatus</span><span class="token punctuation">(</span>name<span class="token punctuation">:</span> env<span class="token punctuation">.</span>STAGE_NAME<span class="token punctuation">,</span> state<span class="token punctuation">:</span> <span class="token string">&#39;success&#39;</span><span class="token punctuation">)</span>
                script<span class="token punctuation">{</span>
                    env<span class="token punctuation">.</span>BUILD_TASKS <span class="token operator">=</span> env<span class="token punctuation">.</span>STAGE_NAME <span class="token operator">+</span> <span class="token interpolation-string"><span class="token string">&quot;√...&quot;</span></span> <span class="token operator">+</span> env<span class="token punctuation">.</span>TAB_STR
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">&#39;CI&#39;</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
            failFast <span class="token boolean">true</span>
            parallel <span class="token punctuation">{</span>
                <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">&#39;Unit Test&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    steps <span class="token punctuation">{</span>
                        echo <span class="token interpolation-string"><span class="token string">&quot;Unit Test Stage Skip...&quot;</span></span>
                    <span class="token punctuation">}</span>
                <span class="token punctuation">}</span>
                <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">&#39;Code Scan&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    steps <span class="token punctuation">{</span>
                        <span class="token function">container</span><span class="token punctuation">(</span><span class="token string">&#39;tools&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                            <span class="token function">withSonarQubeEnv</span><span class="token punctuation">(</span><span class="token string">&#39;sonarqube&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                                sh <span class="token string">&#39;sonar-scanner -X&#39;</span>
                                sleep <span class="token number">3</span>
                            <span class="token punctuation">}</span>
                            script <span class="token punctuation">{</span>
                                <span class="token function">timeout</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                                    <span class="token keyword">def</span> qg <span class="token operator">=</span> <span class="token function">waitForQualityGate</span><span class="token punctuation">(</span><span class="token string">&#39;sonarqube&#39;</span><span class="token punctuation">)</span>
                                    <span class="token keyword">if</span> <span class="token punctuation">(</span>qg<span class="token punctuation">.</span>status <span class="token operator">!=</span> <span class="token string">&#39;OK&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                                        error <span class="token interpolation-string"><span class="token string">&quot;未通过Sonarqube的代码质量阈检查，请及时修改！failure: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token expression">qg<span class="token punctuation">.</span>status</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">&quot;</span></span>
                                    <span class="token punctuation">}</span>
                                <span class="token punctuation">}</span>
                            <span class="token punctuation">}</span>
                        <span class="token punctuation">}</span>
                    <span class="token punctuation">}</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">&#39;build-image&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                <span class="token function">container</span><span class="token punctuation">(</span><span class="token string">&#39;tools&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    <span class="token function">retry</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> sh <span class="token string">&#39;docker build . -t \${IMAGE_REPO}:\${GIT_COMMIT}&#39;</span><span class="token punctuation">}</span>
                <span class="token punctuation">}</span>
                <span class="token function">updateGitlabCommitStatus</span><span class="token punctuation">(</span>name<span class="token punctuation">:</span> env<span class="token punctuation">.</span>STAGE_NAME<span class="token punctuation">,</span> state<span class="token punctuation">:</span> <span class="token string">&#39;success&#39;</span><span class="token punctuation">)</span>
                script<span class="token punctuation">{</span>
                    env<span class="token punctuation">.</span>BUILD_TASKS <span class="token operator">+=</span> env<span class="token punctuation">.</span>STAGE_NAME <span class="token operator">+</span> <span class="token interpolation-string"><span class="token string">&quot;√...&quot;</span></span> <span class="token operator">+</span> env<span class="token punctuation">.</span>TAB_STR
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">&#39;push-image&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                <span class="token function">container</span><span class="token punctuation">(</span><span class="token string">&#39;tools&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    <span class="token function">retry</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> sh <span class="token string">&#39;docker push \${IMAGE_REPO}:\${GIT_COMMIT}&#39;</span><span class="token punctuation">}</span>
                <span class="token punctuation">}</span>
                <span class="token function">updateGitlabCommitStatus</span><span class="token punctuation">(</span>name<span class="token punctuation">:</span> env<span class="token punctuation">.</span>STAGE_NAME<span class="token punctuation">,</span> state<span class="token punctuation">:</span> <span class="token string">&#39;success&#39;</span><span class="token punctuation">)</span>
                script<span class="token punctuation">{</span>
                    env<span class="token punctuation">.</span>BUILD_TASKS <span class="token operator">+=</span> env<span class="token punctuation">.</span>STAGE_NAME <span class="token operator">+</span> <span class="token interpolation-string"><span class="token string">&quot;√...&quot;</span></span> <span class="token operator">+</span> env<span class="token punctuation">.</span>TAB_STR
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">&#39;deploy&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                <span class="token function">container</span><span class="token punctuation">(</span><span class="token string">&#39;tools&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    sh <span class="token interpolation-string"><span class="token string">&quot;sed -i &#39;s#{{IMAGE_URL}}#</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token expression">IMAGE_REPO</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">:</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token expression">GIT_COMMIT</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">#g&#39; deploy/*&quot;</span></span>
                    <span class="token function">timeout</span><span class="token punctuation">(</span>time<span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span> unit<span class="token punctuation">:</span> <span class="token string">&#39;MINUTES&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                        sh <span class="token interpolation-string"><span class="token string">&quot;kubectl apply -f deploy/&quot;</span></span>
                    <span class="token punctuation">}</span>
                <span class="token punctuation">}</span>
                <span class="token function">updateGitlabCommitStatus</span><span class="token punctuation">(</span>name<span class="token punctuation">:</span> env<span class="token punctuation">.</span>STAGE_NAME<span class="token punctuation">,</span> state<span class="token punctuation">:</span> <span class="token string">&#39;success&#39;</span><span class="token punctuation">)</span>
                script<span class="token punctuation">{</span>
                    env<span class="token punctuation">.</span>BUILD_TASKS <span class="token operator">+=</span> env<span class="token punctuation">.</span>STAGE_NAME <span class="token operator">+</span> <span class="token interpolation-string"><span class="token string">&quot;√...&quot;</span></span> <span class="token operator">+</span> env<span class="token punctuation">.</span>TAB_STR
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    post <span class="token punctuation">{</span>
        success <span class="token punctuation">{</span> 
            echo <span class="token string">&#39;Congratulations!&#39;</span>
            sh <span class="token interpolation-string"><span class="token string">&quot;&quot;&quot;
                curl &#39;https://oapi.dingtalk.com/robot/send?access_token=</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token expression">DINGTALK_CREDS_PSW</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">&#39; \\
                    -H &#39;Content-Type: application/json&#39; \\
                    -d &#39;{
                        &quot;msgtype&quot;: &quot;markdown&quot;,
                        &quot;markdown&quot;: {
                            &quot;title&quot;:&quot;myblog&quot;,
                            &quot;text&quot;: &quot;😄👍 构建成功 👍😄  \\n**项目名称**：NOHI  \\n**Git log**: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token expression">GIT_LOG</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">   \\n**构建分支**: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token expression">BRANCH_NAME</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">   \\n**构建地址**：</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token expression">RUN_DISPLAY_URL</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">  \\n**构建任务**：</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token expression">BUILD_TASKS</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">&quot;
                        }
                    }&#39;
            &quot;&quot;&quot;</span></span> 
        <span class="token punctuation">}</span>
        failure <span class="token punctuation">{</span>
            echo <span class="token string">&#39;Oh no!&#39;</span>
            sh <span class="token interpolation-string"><span class="token string">&quot;&quot;&quot;
                curl &#39;https://oapi.dingtalk.com/robot/send?access_token=</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token expression">DINGTALK_CREDS_PSW</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">&#39; \\
                    -H &#39;Content-Type: application/json&#39; \\
                    -d &#39;{
                        &quot;msgtype&quot;: &quot;markdown&quot;,
                        &quot;markdown&quot;: {
                            &quot;title&quot;:&quot;myblog&quot;,
                            &quot;text&quot;: &quot;😖❌ 构建失败 ❌😖  \\n**项目名称**：NOHI  \\n**Git log**: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token expression">GIT_LOG</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">   \\n**构建分支**: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token expression">BRANCH_NAME</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">  \\n**构建地址**：</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token expression">RUN_DISPLAY_URL</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">  \\n**构建任务**：</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token expression">BUILD_TASKS</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">&quot;
                        }
                    }&#39;
            &quot;&quot;&quot;</span></span>
        <span class="token punctuation">}</span>
        always <span class="token punctuation">{</span> 
            echo <span class="token string">&#39;I will always say Hello again!&#39;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote></blockquote><h5 id="集成robotframework实现验收测试" tabindex="-1"><a class="header-anchor" href="#集成robotframework实现验收测试" aria-hidden="true">#</a> 集成RobotFramework实现验收测试</h5><p>一个基于Python语言，用于验收测试和验收测试驱动开发（ATDD）的通用测试自动化框架，提供了一套特定的语法，并且有非常丰富的测试库 。</p><h6 id="robot用例简介" tabindex="-1"><a class="header-anchor" href="#robot用例简介" aria-hidden="true">#</a> robot用例简介</h6><p><code>robot/robot.txt</code></p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span> Settings <span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span>
Library           RequestsLibrary
Library           SeleniumLibrary

<span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span> Variables <span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span>
$<span class="token punctuation">{</span>demo_url<span class="token punctuation">}</span>       http:<span class="token operator">/</span><span class="token operator">/</span>myblog<span class="token punctuation">.</span>nohi<span class="token punctuation">.</span>com/admin

<span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span> Test Cases <span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span>
api
    <span class="token namespace">[Tags]</span>  critical
    Create Session    api    $<span class="token punctuation">{</span>demo_url<span class="token punctuation">}</span>
    $<span class="token punctuation">{</span>alarm_system_info<span class="token punctuation">}</span>    RequestsLibrary<span class="token punctuation">.</span>Get Request    api    <span class="token operator">/</span>
    log    $<span class="token punctuation">{</span>alarm_system_info<span class="token punctuation">.</span>status_code<span class="token punctuation">}</span>
    log    $<span class="token punctuation">{</span>alarm_system_info<span class="token punctuation">.</span>content<span class="token punctuation">}</span>
    should be true    $<span class="token punctuation">{</span>alarm_system_info<span class="token punctuation">.</span>status_code<span class="token punctuation">}</span> == 200

ui
    <span class="token namespace">[Tags]</span>  critical
    $<span class="token punctuation">{</span>options<span class="token punctuation">}</span>=  Evaluate  sys<span class="token punctuation">.</span>modules<span class="token punctuation">[</span><span class="token string">&#39;selenium.webdriver&#39;</span><span class="token punctuation">]</span><span class="token punctuation">.</span>ChromeOptions<span class="token punctuation">(</span><span class="token punctuation">)</span>  sys<span class="token punctuation">,</span> selenium<span class="token punctuation">.</span>webdriver
    Call Method    $<span class="token punctuation">{</span>options<span class="token punctuation">}</span>    add_argument    <span class="token operator">--</span>headless
    Call Method    $<span class="token punctuation">{</span>options<span class="token punctuation">}</span>    add_argument    <span class="token operator">--</span>no-sandbox
    create webdriver  Chrome  chrome_options=$<span class="token punctuation">{</span>options<span class="token punctuation">}</span>
    Maximize Browser Window
    go to   $<span class="token punctuation">{</span>demo_url<span class="token punctuation">}</span><span class="token operator">/</span>
    <span class="token function">sleep</span>    2s
    Maximize Browser Window
    Capture Page Screenshot
    Page Should Contain    Django
    close browser
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token comment"># 使用tools镜像启动容器，来验证手动使用robotframework来做验收测试</span>
$ docker run <span class="token operator">--</span><span class="token function">rm</span> <span class="token operator">-</span>ti 10<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>181:5000/devops/tools:v2 bash
<span class="token comment"># vi /etc/hosts</span>
10<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>181 myblog<span class="token punctuation">.</span>nohi<span class="token punctuation">.</span>com
bash-5<span class="token punctuation">.</span>0<span class="token comment"># apk add chromium chromium-chromedriver</span>
$ <span class="token function">cat</span> requirements<span class="token punctuation">.</span>txt
robotframework
robotframework-seleniumlibrary
robotframework-databaselibrary
robotframework-requests

<span class="token comment">#pip安装必要的软件包</span>
$ pip install <span class="token operator">-</span>i http:<span class="token operator">/</span><span class="token operator">/</span>mirrors<span class="token punctuation">.</span>aliyun<span class="token punctuation">.</span>com/pypi/simple/ <span class="token operator">--</span>trusted-host mirrors<span class="token punctuation">.</span>aliyun<span class="token punctuation">.</span>com <span class="token operator">-</span>r requirements<span class="token punctuation">.</span>txt 

<span class="token comment">#使用robot命令做测试</span>
$ robot <span class="token operator">-</span>d artifacts/ robot<span class="token punctuation">.</span>txt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="与tools工具镜像集成" tabindex="-1"><a class="header-anchor" href="#与tools工具镜像集成" aria-hidden="true">#</a> 与tools工具镜像集成</h6><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token keyword">FROM</span> alpine
LABEL maintainer=<span class="token string">&quot;thisisnohi@163.com&quot;</span>
USER root

RUN sed <span class="token operator">-</span>i <span class="token string">&#39;s/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g&#39;</span> <span class="token operator">/</span>etc/apk/repositories &amp;&amp; \\
    apk update &amp;&amp; \\
    apk add  <span class="token operator">--</span>no-cache openrc docker git curl tar gcc g+<span class="token operator">+</span> make \\
    bash shadow openjdk11 python3 py-pip python3-dev openssl-dev libffi-dev \\
    libstdc+<span class="token operator">+</span> harfbuzz nss freetype ttf-freefont chromium chromium-chromedriver &amp;&amp; \\
    mkdir <span class="token operator">-</span>p <span class="token operator">/</span>root/<span class="token punctuation">.</span>kube &amp;&amp; \\
    usermod <span class="token operator">-</span>a <span class="token operator">-</span>G docker root


<span class="token function">COPY</span> config <span class="token operator">/</span>root/<span class="token punctuation">.</span>kube/

<span class="token function">COPY</span> requirements<span class="token punctuation">.</span>txt <span class="token operator">/</span>

RUN pip install <span class="token operator">-</span>i http:<span class="token operator">/</span><span class="token operator">/</span>mirrors<span class="token punctuation">.</span>aliyun<span class="token punctuation">.</span>com/pypi/simple/ <span class="token operator">--</span>trusted-host mirrors<span class="token punctuation">.</span>aliyun<span class="token punctuation">.</span>com <span class="token operator">-</span>r requirements<span class="token punctuation">.</span>txt 


RUN <span class="token function">rm</span> <span class="token operator">-</span>rf <span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>cache/apk/<span class="token operator">*</span> &amp;&amp; \\
    <span class="token function">rm</span> <span class="token operator">-</span>rf ~<span class="token operator">/</span><span class="token punctuation">.</span>cache/pip

<span class="token comment">#-----------------安装 kubectl--------------------#</span>
<span class="token function">COPY</span> kubectl <span class="token operator">/</span>usr/local/bin/
RUN chmod <span class="token operator">+</span>x <span class="token operator">/</span>usr/local/bin/kubectl
<span class="token comment"># ------------------------------------------------#</span>

<span class="token comment">#---------------安装 sonar-scanner-----------------#</span>
<span class="token function">COPY</span> sonar-scanner <span class="token operator">/</span>usr/lib/sonar-scanner
RUN ln <span class="token operator">-</span>s <span class="token operator">/</span>usr/lib/sonar-scanner/bin/sonar-scanner <span class="token operator">/</span>usr/local/bin/sonar-scanner &amp;&amp; chmod <span class="token operator">+</span>x <span class="token operator">/</span>usr/local/bin/sonar-scanner
ENV SONAR_RUNNER_HOME=<span class="token operator">/</span>usr/lib/sonar-scanner
<span class="token comment"># ------------------------------------------------#</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ docker build <span class="token punctuation">.</span> <span class="token operator">-</span>t 10<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>181:5000/devops/tools:v3

$ docker push 10<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>181:5000/devops/tools:v3
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>更新Jenkins中kubernetes中的containers template</p><blockquote><p>系统管理-&gt;节点管理-&gt;clouds-&gt;Pod Templates-&gt;Pod Template details-&gt;容器列表 docker镜像修改版本为v3</p></blockquote><h6 id="插件安装及配置-2" tabindex="-1"><a class="header-anchor" href="#插件安装及配置-2" aria-hidden="true">#</a> 插件安装及配置</h6><p>为什么要安装robot插件？</p><ol><li><p>安装robotFramework</p><ul><li>插件中心搜索robotframework，直接安装</li><li>tools集成robot命令（之前已经安装）</li></ul></li><li><p>与jenkinsfile的集成</p><div class="language-groovy line-numbers-mode" data-ext="groovy"><pre class="language-groovy"><code>    <span class="token function">container</span><span class="token punctuation">(</span><span class="token string">&#39;tools&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        sh <span class="token string">&#39;robot -i critical  -d artifacts/ robot.txt || echo ok&#39;</span>
        echo <span class="token interpolation-string"><span class="token string">&quot;R </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token expression">currentBuild<span class="token punctuation">.</span>result</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">&quot;</span></span>
        <span class="token function">step</span><span class="token punctuation">(</span><span class="token punctuation">[</span>
            <span class="token punctuation">$</span><span class="token keyword">class</span> <span class="token punctuation">:</span> <span class="token string">&#39;RobotPublisher&#39;</span><span class="token punctuation">,</span>
            outputPath<span class="token punctuation">:</span> <span class="token string">&#39;artifacts/&#39;</span><span class="token punctuation">,</span>
            outputFileName <span class="token punctuation">:</span> <span class="token interpolation-string"><span class="token string">&quot;output.xml&quot;</span></span><span class="token punctuation">,</span>
            disableArchiveOutput <span class="token punctuation">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
            passThreshold <span class="token punctuation">:</span> <span class="token number">80</span><span class="token punctuation">,</span>
            unstableThreshold<span class="token punctuation">:</span> <span class="token number">20.0</span><span class="token punctuation">,</span>
            onlyCritical <span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
            otherFiles <span class="token punctuation">:</span> <span class="token interpolation-string"><span class="token string">&quot;*.png&quot;</span></span>
        <span class="token punctuation">]</span><span class="token punctuation">)</span>
        echo <span class="token interpolation-string"><span class="token string">&quot;R </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token expression">currentBuild<span class="token punctuation">.</span>result</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">&quot;</span></span>
        archiveArtifacts artifacts<span class="token punctuation">:</span> <span class="token string">&#39;artifacts/*&#39;</span><span class="token punctuation">,</span> fingerprint<span class="token punctuation">:</span> <span class="token boolean">true</span>
    <span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><h6 id="实践通过jenkinsfile实现demo项目的验收测试" tabindex="-1"><a class="header-anchor" href="#实践通过jenkinsfile实现demo项目的验收测试" aria-hidden="true">#</a> 实践通过Jenkinsfile实现demo项目的验收测试</h6><p>python-demo项目添加robot.txt文件：</p><p><code>jenkins/pipelines/p10.yaml</code></p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>pipeline <span class="token punctuation">{</span>
    agent <span class="token punctuation">{</span> label <span class="token string">&#39;jnlp-slave&#39;</span><span class="token punctuation">}</span>
    
    options <span class="token punctuation">{</span>
		buildDiscarder<span class="token punctuation">(</span>logRotator<span class="token punctuation">(</span>numToKeepStr: <span class="token string">&#39;10&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
		disableConcurrentBuilds<span class="token punctuation">(</span><span class="token punctuation">)</span>
		timeout<span class="token punctuation">(</span>time: 20<span class="token punctuation">,</span> unit: <span class="token string">&#39;MINUTES&#39;</span><span class="token punctuation">)</span>
		gitLabConnection<span class="token punctuation">(</span><span class="token string">&#39;gitlab&#39;</span><span class="token punctuation">)</span>
	<span class="token punctuation">}</span>

    environment <span class="token punctuation">{</span>
        IMAGE_REPO = <span class="token string">&quot;10.0.0.181:5000/myblog&quot;</span>
        DINGTALK_CREDS = credentials<span class="token punctuation">(</span><span class="token string">&#39;dingTalk&#39;</span><span class="token punctuation">)</span>
        TAB_STR = <span class="token string">&quot;\\n                    \\n&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&quot;</span>
    <span class="token punctuation">}</span>

    stages <span class="token punctuation">{</span>
        stage<span class="token punctuation">(</span><span class="token string">&#39;git-log&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                script<span class="token punctuation">{</span>
                    sh <span class="token string">&quot;git log --oneline -n 1 &gt; gitlog.file&quot;</span>
                    env<span class="token punctuation">.</span>GIT_LOG = readFile<span class="token punctuation">(</span><span class="token string">&quot;gitlog.file&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span>trim<span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token punctuation">}</span>
                sh <span class="token string">&#39;printenv&#39;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>        
        stage<span class="token punctuation">(</span><span class="token string">&#39;checkout&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                container<span class="token punctuation">(</span><span class="token string">&#39;tools&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    checkout scm
                <span class="token punctuation">}</span>
                updateGitlabCommitStatus<span class="token punctuation">(</span>name: env<span class="token punctuation">.</span>STAGE_NAME<span class="token punctuation">,</span> state: <span class="token string">&#39;success&#39;</span><span class="token punctuation">)</span>
                script<span class="token punctuation">{</span>
                    env<span class="token punctuation">.</span>BUILD_TASKS = env<span class="token punctuation">.</span>STAGE_NAME <span class="token operator">+</span> <span class="token string">&quot;√...&quot;</span> <span class="token operator">+</span> env<span class="token punctuation">.</span>TAB_STR
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        stage<span class="token punctuation">(</span><span class="token string">&#39;CI&#39;</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
            failFast true
            <span class="token keyword">parallel</span> <span class="token punctuation">{</span>
                stage<span class="token punctuation">(</span><span class="token string">&#39;Unit Test&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    steps <span class="token punctuation">{</span>
                        <span class="token function">echo</span> <span class="token string">&quot;Unit Test Stage Skip...&quot;</span>
                    <span class="token punctuation">}</span>
                <span class="token punctuation">}</span>
                stage<span class="token punctuation">(</span><span class="token string">&#39;Code Scan&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    steps <span class="token punctuation">{</span>
                        container<span class="token punctuation">(</span><span class="token string">&#39;tools&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                            withSonarQubeEnv<span class="token punctuation">(</span><span class="token string">&#39;sonarqube&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                                sh <span class="token string">&#39;sonar-scanner -X&#39;</span>
                                <span class="token function">sleep</span> 3
                            <span class="token punctuation">}</span>
                            script <span class="token punctuation">{</span>
                                timeout<span class="token punctuation">(</span>1<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                                    def qg = waitForQualityGate<span class="token punctuation">(</span><span class="token string">&#39;sonarqube&#39;</span><span class="token punctuation">)</span>
                                    <span class="token keyword">if</span> <span class="token punctuation">(</span>qg<span class="token punctuation">.</span>status <span class="token operator">!</span>= <span class="token string">&#39;OK&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                                        error <span class="token string">&quot;未通过Sonarqube的代码质量阈检查，请及时修改！failure: \${qg.status}&quot;</span>
                                    <span class="token punctuation">}</span>
                                <span class="token punctuation">}</span>
                            <span class="token punctuation">}</span>
                        <span class="token punctuation">}</span>
                    <span class="token punctuation">}</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        stage<span class="token punctuation">(</span><span class="token string">&#39;build-image&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                container<span class="token punctuation">(</span><span class="token string">&#39;tools&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    retry<span class="token punctuation">(</span>2<span class="token punctuation">)</span> <span class="token punctuation">{</span> sh <span class="token string">&#39;docker build . -t \${IMAGE_REPO}:\${GIT_COMMIT}&#39;</span><span class="token punctuation">}</span>
                <span class="token punctuation">}</span>
                updateGitlabCommitStatus<span class="token punctuation">(</span>name: env<span class="token punctuation">.</span>STAGE_NAME<span class="token punctuation">,</span> state: <span class="token string">&#39;success&#39;</span><span class="token punctuation">)</span>
                script<span class="token punctuation">{</span>
                    env<span class="token punctuation">.</span>BUILD_TASKS <span class="token operator">+=</span> env<span class="token punctuation">.</span>STAGE_NAME <span class="token operator">+</span> <span class="token string">&quot;√...&quot;</span> <span class="token operator">+</span> env<span class="token punctuation">.</span>TAB_STR
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        stage<span class="token punctuation">(</span><span class="token string">&#39;push-image&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                container<span class="token punctuation">(</span><span class="token string">&#39;tools&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    retry<span class="token punctuation">(</span>2<span class="token punctuation">)</span> <span class="token punctuation">{</span> sh <span class="token string">&#39;docker push \${IMAGE_REPO}:\${GIT_COMMIT}&#39;</span><span class="token punctuation">}</span>
                <span class="token punctuation">}</span>
                updateGitlabCommitStatus<span class="token punctuation">(</span>name: env<span class="token punctuation">.</span>STAGE_NAME<span class="token punctuation">,</span> state: <span class="token string">&#39;success&#39;</span><span class="token punctuation">)</span>
                script<span class="token punctuation">{</span>
                    env<span class="token punctuation">.</span>BUILD_TASKS <span class="token operator">+=</span> env<span class="token punctuation">.</span>STAGE_NAME <span class="token operator">+</span> <span class="token string">&quot;√...&quot;</span> <span class="token operator">+</span> env<span class="token punctuation">.</span>TAB_STR
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        stage<span class="token punctuation">(</span><span class="token string">&#39;deploy&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                container<span class="token punctuation">(</span><span class="token string">&#39;tools&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    sh <span class="token string">&quot;sed -i &#39;s#{{IMAGE_URL}}#\${IMAGE_REPO}:\${GIT_COMMIT}#g&#39; deploy/*&quot;</span>
                    timeout<span class="token punctuation">(</span>time: 1<span class="token punctuation">,</span> unit: <span class="token string">&#39;MINUTES&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                        sh <span class="token string">&quot;kubectl apply -f deploy/;sleep 20;&quot;</span>
                    <span class="token punctuation">}</span>
                <span class="token punctuation">}</span>
                updateGitlabCommitStatus<span class="token punctuation">(</span>name: env<span class="token punctuation">.</span>STAGE_NAME<span class="token punctuation">,</span> state: <span class="token string">&#39;success&#39;</span><span class="token punctuation">)</span>
                script<span class="token punctuation">{</span>
                    env<span class="token punctuation">.</span>BUILD_TASKS <span class="token operator">+=</span> env<span class="token punctuation">.</span>STAGE_NAME <span class="token operator">+</span> <span class="token string">&quot;√...&quot;</span> <span class="token operator">+</span> env<span class="token punctuation">.</span>TAB_STR
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        stage<span class="token punctuation">(</span><span class="token string">&#39;Accept Test&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                    container<span class="token punctuation">(</span><span class="token string">&#39;tools&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                        sh <span class="token string">&#39;robot -i critical  -d artifacts/ robot.txt|| echo ok&#39;</span>
                        <span class="token function">echo</span> <span class="token string">&quot;R \${currentBuild.result}&quot;</span>
                        step<span class="token punctuation">(</span><span class="token punctuation">[</span>
                            <span class="token variable">$class</span> : <span class="token string">&#39;RobotPublisher&#39;</span><span class="token punctuation">,</span>
                            outputPath: <span class="token string">&#39;artifacts/&#39;</span><span class="token punctuation">,</span>
                            outputFileName : <span class="token string">&quot;output.xml&quot;</span><span class="token punctuation">,</span>
                            disableArchiveOutput : false<span class="token punctuation">,</span>
                            passThreshold : 80<span class="token punctuation">,</span>
                            unstableThreshold: 20<span class="token punctuation">.</span>0<span class="token punctuation">,</span>
                            onlyCritical : true<span class="token punctuation">,</span>
                            otherFiles : <span class="token string">&quot;*.png&quot;</span>
                        <span class="token punctuation">]</span><span class="token punctuation">)</span>
                        <span class="token function">echo</span> <span class="token string">&quot;R \${currentBuild.result}&quot;</span>
                        archiveArtifacts artifacts: <span class="token string">&#39;artifacts/*&#39;</span><span class="token punctuation">,</span> fingerprint: true
                    <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    post <span class="token punctuation">{</span>
        success <span class="token punctuation">{</span> 
            <span class="token function">echo</span> <span class="token string">&#39;Congratulations!&#39;</span>
            sh <span class="token string">&quot;&quot;</span><span class="token string">&quot;
                curl &#39;https://oapi.dingtalk.com/robot/send?access_token=\${DINGTALK_CREDS_PSW}&#39; \\
                    -H &#39;Content-Type: application/json&#39; \\
                    -d &#39;{
                        &quot;</span>msgtype<span class="token string">&quot;: &quot;</span>markdown<span class="token string">&quot;,
                        &quot;</span>markdown<span class="token string">&quot;: {
                            &quot;</span>title<span class="token string">&quot;:&quot;</span>myblog<span class="token string">&quot;,
                            &quot;</span>text<span class="token string">&quot;: &quot;</span>😄👍 构建成功 👍😄  \\n*<span class="token operator">*</span>项目名称<span class="token operator">*</span><span class="token operator">*</span>：NOHI  \\n*<span class="token operator">*</span>Git log*<span class="token operator">*</span>: $<span class="token punctuation">{</span>GIT_LOG<span class="token punctuation">}</span>   \\n*<span class="token operator">*</span>构建分支<span class="token operator">*</span><span class="token operator">*</span>: $<span class="token punctuation">{</span>BRANCH_NAME<span class="token punctuation">}</span>   \\n*<span class="token operator">*</span>构建地址<span class="token operator">*</span><span class="token operator">*</span>：$<span class="token punctuation">{</span>RUN_DISPLAY_URL<span class="token punctuation">}</span>  \\n*<span class="token operator">*</span>构建任务<span class="token operator">*</span><span class="token operator">*</span>：$<span class="token punctuation">{</span>BUILD_TASKS<span class="token punctuation">}</span><span class="token string">&quot;
                        }
                    }&#39;
            &quot;</span><span class="token string">&quot;&quot;</span> 
        <span class="token punctuation">}</span>
        failure <span class="token punctuation">{</span>
            <span class="token function">echo</span> <span class="token string">&#39;Oh no!&#39;</span>
            sh <span class="token string">&quot;&quot;</span><span class="token string">&quot;
                curl &#39;https://oapi.dingtalk.com/robot/send?access_token=\${DINGTALK_CREDS_PSW}&#39; \\
                    -H &#39;Content-Type: application/json&#39; \\
                    -d &#39;{
                        &quot;</span>msgtype<span class="token string">&quot;: &quot;</span>markdown<span class="token string">&quot;,
                        &quot;</span>markdown<span class="token string">&quot;: {
                            &quot;</span>title<span class="token string">&quot;:&quot;</span>myblog<span class="token string">&quot;,
                            &quot;</span>text<span class="token string">&quot;: &quot;</span>😖❌ 构建失败 ❌😖  \\n*<span class="token operator">*</span>项目名称<span class="token operator">*</span><span class="token operator">*</span>：NOHI  \\n*<span class="token operator">*</span>Git log*<span class="token operator">*</span>: $<span class="token punctuation">{</span>GIT_LOG<span class="token punctuation">}</span>   \\n*<span class="token operator">*</span>构建分支<span class="token operator">*</span><span class="token operator">*</span>: $<span class="token punctuation">{</span>BRANCH_NAME<span class="token punctuation">}</span>  \\n*<span class="token operator">*</span>构建地址<span class="token operator">*</span><span class="token operator">*</span>：$<span class="token punctuation">{</span>RUN_DISPLAY_URL<span class="token punctuation">}</span>  \\n*<span class="token operator">*</span>构建任务<span class="token operator">*</span><span class="token operator">*</span>：$<span class="token punctuation">{</span>BUILD_TASKS<span class="token punctuation">}</span><span class="token string">&quot;
                        }
                    }&#39;
            &quot;</span><span class="token string">&quot;&quot;</span>
        <span class="token punctuation">}</span>
        always <span class="token punctuation">{</span> 
            <span class="token function">echo</span> <span class="token string">&#39;I will always say Hello again!&#39;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在Jenkins中查看robot的构建结果。</p><blockquote></blockquote><h4 id="小结" tabindex="-1"><a class="header-anchor" href="#小结" aria-hidden="true">#</a> 小结</h4><p>思路：</p><ol><li>讲解最基础的Jenkins的使用</li><li>Pipeline流水线的使用</li><li>Jenkinsfile的使用</li><li>多分支流水线的使用</li><li>与Kubernetes集成，动态jnlp slave pod的使用</li><li>与sonarqube集成，实现代码扫描</li><li>与Robotframework集成，实现验收测试</li></ol><p>问题：</p><ol><li>Jenkinsfile过于冗长</li><li>多个项目配置Jenkinsfile，存在很多重复内容</li><li>没有实现根据不同分支来部署到不同的环境</li><li>Java项目的构建</li><li>k8s部署后，采用等待的方式执行后续步骤，不合理</li></ol>`,77);function jn(En,In){const a=i("ExternalLinkIcon");return o(),l("div",null,[R,n("p",null,[n("a",M,[s("其他部署方式"),e(a)])]),G,n("p",null,[n("a",$,[s("官方文档"),e(a)])]),P,n("p",null,[n("a",O,[s("官方文档"),e(a)])]),N,n("p",null,[n("a",D,[s("官方文档"),e(a)])]),L,n("ul",null,[B,n("li",null,[n("p",null,[s("stages: 包含一系列一个或多个 "),n("a",U,[s("stage"),e(a)]),s("指令, "),J,s(' 部分是流水线描述的大部分"work" 的位置。 建议 '),K,s(" 至少包含一个 "),n("a",H,[s("stage"),e(a)]),s(" 指令用于连续交付过程的每个离散部分,比如构建, 测试, 和部署。")]),F]),n("li",null,[n("p",null,[s("steps: 在给定的 "),z,s(" 指令中执行的定义了一系列的一个或多个"),n("a",Y,[s("steps"),e(a)]),s("。")])]),n("li",null,[n("p",null,[s("post: 定义一个或多个"),n("a",V,[s("steps"),e(a)]),s(" ，这些阶段根据流水线或阶段的完成情况而运行"),W,s(" 支持以下 "),n("a",Q,[s("post-condition"),e(a)]),s(" 块中的其中之一: "),X,s(", "),Z,s(", "),nn,s(", "),sn,s(", "),an,s(", 和 "),en,s("。")]),tn])]),pn,n("p",null,[n("a",on,[s("官方文档"),e(a)])]),ln,n("p",null,[s("Jenkins 的声明式流水线语法有一个 "),cn,s(" 辅助方法（在"),n("a",un,[rn,e(a)]),s(" 指令中使用），它支持 "),n("a",dn,[s("secret 文本"),e(a)]),s("，"),n("a",kn,[s("带密码的用户名"),e(a)]),s("，以及 "),n("a",vn,[s("secret 文件"),e(a)]),s("凭据。")]),mn,bn,n("p",null,[s("当在 "),n("a",gn,[hn,e(a)]),s(" 指令中设置凭据环境变量时：")]),qn,n("p",null,[n("a",yn,[s("官方示例"),e(a)])]),_n,n("p",null,[n("a",fn,[s("插件官方文档"),e(a)])]),n("ol",null,[n("li",null,[wn,n("p",null,[s("若安装失败，请先更新"),n("a",Sn,[s(" bouncycastle API Plugin"),e(a)]),s("并重新启动Jenkins")])]),Tn]),An])}const Cn=p(C,[["render",jn],["__file","14_Docker_k8s教程-05从零开始构建基于Kubernetes的DevOps平台.html.vue"]]);export{Cn as default};
