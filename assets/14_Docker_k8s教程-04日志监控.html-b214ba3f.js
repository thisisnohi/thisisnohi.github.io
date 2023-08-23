import{_ as o,M as c,p as u,q as r,R as n,t as s,N as e,a1 as t}from"./framework-449724a9.js";const d="/assets/logging-with-node-agent-7a42f6c9.png",v="/assets/logging-with-streaming-sidecar-052e3c80.png",m="/assets/logging-with-sidecar-agent-0d5eace1.png",k="/assets/logging-from-application-761565d4.png",b="/assets/EFK-architecture-759e0e35.png",g="/assets/fluentd-architecture-6b70fbfb.jpg",h="/assets/what-is-fluentd-cca5789c.jpg",_="/assets/log-as-json-f270d988.png",f="/assets/pluggable-797fc246.png",y="/assets/c-and-ruby-df471a7a.png",q="/assets/buffer-internal-and-parameters-8c62e50d.png",w="/assets/logstash-20230305-435adf63.png",x="/assets/monitor-earlier-dc066915.png",P="/assets/custom-hpa-2de34879.webp",$="/assets/prometheus-ff911db4.svg",S="/assets/prometheus-target-err1-36a096af.jpg",i="/assets/when-relabel-work-fa7d1040.png",M="/assets/prometheus-target-err2-0921ce6b.png",p="/assets/alertmanager-97b5baef.png",A="/assets/alertmanager-process-f745d46a.png",l="/assets/hpa-prometheus-custom-01081e27.png",C="/assets/customer-metrics-8891a20e.png",T={},V=t('<h1 id="_14-04-docker-k8s教程-04日志监控" tabindex="-1"><a class="header-anchor" href="#_14-04-docker-k8s教程-04日志监控" aria-hidden="true">#</a> 14-04_Docker+k8s教程-04日志监控</h1><h2 id="四、日志及监控" tabindex="-1"><a class="header-anchor" href="#四、日志及监控" aria-hidden="true">#</a> 四、日志及监控</h2><h3 id="第四天-kubernetes集群的日志及监控" tabindex="-1"><a class="header-anchor" href="#第四天-kubernetes集群的日志及监控" aria-hidden="true">#</a> 第四天 Kubernetes集群的日志及监控</h3><h4 id="k8s日志收集架构" tabindex="-1"><a class="header-anchor" href="#k8s日志收集架构" aria-hidden="true">#</a> k8s日志收集架构</h4><p>https://kubernetes.io/docs/concepts/cluster-administration/logging/</p><p>总体分为三种方式：</p><ul><li>使用在每个节点上运行的节点级日志记录代理。</li><li>在应用程序的 pod 中，包含专门记录日志的 sidecar 容器。</li><li>将日志直接从应用程序中推送到日志记录后端。</li></ul><h5 id="使用节点级日志代理" tabindex="-1"><a class="header-anchor" href="#使用节点级日志代理" aria-hidden="true">#</a> 使用节点级日志代理</h5><p><img src="'+d+`" alt=""></p><p>容器日志驱动：</p><p>https://docs.docker.com/config/containers/logging/configure/</p><p>查看当前的docker主机的驱动：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ docker info <span class="token operator">--</span>format <span class="token string">&#39;{{.LoggingDriver}}&#39;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>json-file格式，docker会默认将标准和错误输出保存为宿主机的文件，路径为：</p><p><code>/var/lib/docker/containers/&lt;container-id&gt;/&lt;container-id&gt;-json.log</code></p><p>并且可以设置日志轮转：</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;log-driver&quot;</span><span class="token operator">:</span> <span class="token string">&quot;json-file&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;log-opts&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;max-size&quot;</span><span class="token operator">:</span> <span class="token string">&quot;10m&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;max-file&quot;</span><span class="token operator">:</span> <span class="token string">&quot;3&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;labels&quot;</span><span class="token operator">:</span> <span class="token string">&quot;production_status&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;env&quot;</span><span class="token operator">:</span> <span class="token string">&quot;os,customer&quot;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>优势：</p><ul><li>部署方便，使用DaemonSet类型控制器来部署agent即可</li><li>对业务应用的影响最小，没有侵入性</li></ul><p>劣势:</p><ul><li>只能收集标准和错误输出，对于容器内的文件日志，暂时收集不到</li></ul><h5 id="使用-sidecar-容器和日志代理" tabindex="-1"><a class="header-anchor" href="#使用-sidecar-容器和日志代理" aria-hidden="true">#</a> 使用 sidecar 容器和日志代理</h5><ul><li><h6 id="方式一-sidecar-容器将应用程序日志传送到自己的标准输出。" tabindex="-1"><a class="header-anchor" href="#方式一-sidecar-容器将应用程序日志传送到自己的标准输出。" aria-hidden="true">#</a> 方式一：sidecar 容器将应用程序日志传送到自己的标准输出。</h6><p>思路：在pod中启动一个sidecar容器，把容器内的日志文件吐到标准输出，由宿主机中的日志收集agent进行采集。</p><p><img src="`+v+`" alt=""></p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ <span class="token function">cat</span> count-pod<span class="token punctuation">.</span>yaml
apiVersion: v1
kind: Pod
metadata:
  name: counter
spec:
  containers:
  <span class="token operator">-</span> name: count
    image: busybox
    args:
    <span class="token operator">-</span> <span class="token operator">/</span>bin/sh
    <span class="token operator">-</span> <span class="token operator">-</span>c
    <span class="token operator">-</span> &gt;
      i=0<span class="token punctuation">;</span>
      <span class="token keyword">while</span> true<span class="token punctuation">;</span>
      <span class="token keyword">do</span>
        <span class="token function">echo</span> <span class="token string">&quot;<span class="token variable">$i</span>: <span class="token function">$<span class="token punctuation">(</span>date<span class="token punctuation">)</span></span>&quot;</span> &gt;&gt; <span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>log/1<span class="token punctuation">.</span>log<span class="token punctuation">;</span>
        <span class="token function">echo</span> <span class="token string">&quot;<span class="token function">$<span class="token punctuation">(</span>date<span class="token punctuation">)</span></span> INFO <span class="token variable">$i</span>&quot;</span> &gt;&gt; <span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>log/2<span class="token punctuation">.</span>log<span class="token punctuation">;</span>
        i=$<span class="token punctuation">(</span><span class="token punctuation">(</span>i+1<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token function">sleep</span> 1<span class="token punctuation">;</span>
      done
    volumeMounts:
    <span class="token operator">-</span> name: varlog
      mountPath: <span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>log
  <span class="token operator">-</span> name: count-log-1
    image: busybox
    args: <span class="token punctuation">[</span><span class="token operator">/</span>bin/sh<span class="token punctuation">,</span> <span class="token operator">-</span>c<span class="token punctuation">,</span> <span class="token string">&#39;tail -n+1 -f /var/log/1.log&#39;</span><span class="token punctuation">]</span>
    volumeMounts:
    <span class="token operator">-</span> name: varlog
      mountPath: <span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>log
  <span class="token operator">-</span> name: count-log-2
    image: busybox
    args: <span class="token punctuation">[</span><span class="token operator">/</span>bin/sh<span class="token punctuation">,</span> <span class="token operator">-</span>c<span class="token punctuation">,</span> <span class="token string">&#39;tail -n+1 -f /var/log/2.log&#39;</span><span class="token punctuation">]</span>
    volumeMounts:
    <span class="token operator">-</span> name: varlog
      mountPath: <span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>log
  volumes:
  <span class="token operator">-</span> name: varlog
    emptyDir: <span class="token punctuation">{</span><span class="token punctuation">}</span>
    
$ kubectl create <span class="token operator">-</span>f counter-pod<span class="token punctuation">.</span>yaml
$ kubectl logs <span class="token operator">-</span>f counter <span class="token operator">-</span>c count-log-1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>优势：</p><ul><li>可以实现容器内部日志收集</li><li>对业务应用的侵入性不大</li></ul><p>劣势：</p><ul><li>每个业务pod都需要做一次改造</li><li>增加了一次日志的写入，对磁盘使用率有一定影响</li></ul></li><li><h6 id="方式二-sidecar-容器运行一个日志代理-配置该日志代理以便从应用容器收集日志。" tabindex="-1"><a class="header-anchor" href="#方式二-sidecar-容器运行一个日志代理-配置该日志代理以便从应用容器收集日志。" aria-hidden="true">#</a> 方式二：sidecar 容器运行一个日志代理，配置该日志代理以便从应用容器收集日志。</h6><p><img src="`+m+'" alt=""></p><p>思路：直接在业务Pod中使用sidecar的方式启动一个日志收集的组件（比如fluentd），这样日志收集可以将容器内的日志当成本地文件来进行收取。</p><p>优势：不用往宿主机存储日志，本地日志完全可以收集</p><p>劣势：每个业务应用额外启动一个日志agent，带来额外的资源损耗</p></li></ul><h5 id="从应用中直接暴露日志目录" tabindex="-1"><a class="header-anchor" href="#从应用中直接暴露日志目录" aria-hidden="true">#</a> 从应用中直接暴露日志目录</h5><p><img src="'+k+'" alt=""></p><h5 id="企业日志方案选型" tabindex="-1"><a class="header-anchor" href="#企业日志方案选型" aria-hidden="true">#</a> 企业日志方案选型</h5><p>目前来讲，最建议的是采用节点级的日志代理。</p><p>方案一：自研方案，实现一个自研的日志收集agent，大致思路：</p><ul><li>针对容器的标准输出及错误输出，使用常规的方式，监听宿主机中的容器输出路径即可</li><li>针对容器内部的日志文件 <ul><li>在容器内配置统一的环境变量，比如LOG_COLLECT_FILES，指定好容器内待收集的日志目录及文件</li><li>agent启动的时候挂载docker.sock文件及磁盘的根路径</li><li>监听docker的容器新建、删除事件，通过docker的api，查出容器的存储、环境变量、k8s属性等信息</li><li>配置了LOG_COLLECT_FILES环境变量的容器，根据env中的日志路径找到主机中对应的文件路径，然后生成收集的配置文件</li><li>agent与开源日志收集工具（Fluentd或者filebeat等）配合，agent负责下发配置到收集工具中并对进程做reload</li></ul></li></ul><p>方案二：日志使用开源的Agent进行收集（EFK方案），适用范围广，可以满足绝大多数日志收集、展示的需求。</p><h4 id="实践使用efk实现业务日志收集" tabindex="-1"><a class="header-anchor" href="#实践使用efk实现业务日志收集" aria-hidden="true">#</a> 实践使用EFK实现业务日志收集</h4><h5 id="efk架构工作流程" tabindex="-1"><a class="header-anchor" href="#efk架构工作流程" aria-hidden="true">#</a> EFK架构工作流程</h5><p><img src="'+b+'" alt=""></p>',33),R=n("li",null,[n("p",null,"Elasticsearch"),n("p",null,"一个开源的分布式、Restful 风格的搜索和数据分析引擎，它的底层是开源库Apache Lucene。它可以被下面这样准确地形容："),n("ul",null,[n("li",null,"一个分布式的实时文档存储，每个字段可以被索引与搜索；"),n("li",null,"一个分布式实时分析搜索引擎；"),n("li",null,"能胜任上百个服务节点的扩展，并支持 PB 级别的结构化或者非结构化数据。")])],-1),I=n("li",null,[n("p",null,"Kibana"),n("p",null,"Kibana是一个开源的分析和可视化平台，设计用于和Elasticsearch一起工作。可以通过Kibana来搜索，查看，并和存储在Elasticsearch索引中的数据进行交互。也可以轻松地执行高级数据分析，并且以各种图标、表格和地图的形式可视化数据。")],-1),E={href:"https://docs.fluentd.org/",target:"_blank",rel:"noopener noreferrer"},j=n("p",null,"一个针对日志的收集、处理、转发系统。通过丰富的插件系统，可以收集来自于各种系统或应用的日志，转化为用户指定的格式后，转发到用户所指定的日志存储系统之中。",-1),N=n("p",null,[n("img",{src:g,alt:""})],-1),D=n("p",null,"Fluentd 通过一组给定的数据源抓取日志数据，处理后（转换成结构化的数据格式）将它们转发给其他服务，比如 Elasticsearch、对象存储、kafka等等。Fluentd 支持超过300个日志存储和分析服务，所以在这方面是非常灵活的。主要运行步骤如下",-1),L=n("ol",null,[n("li",null,"首先 Fluentd 从多个日志源获取数据"),n("li",null,"结构化并且标记这些数据"),n("li",null,"然后根据匹配的标签将数据发送到多个目标服务")],-1),G=t('<h5 id="fluentd精讲" tabindex="-1"><a class="header-anchor" href="#fluentd精讲" aria-hidden="true">#</a> Fluentd精讲</h5><h6 id="fluentd架构" tabindex="-1"><a class="header-anchor" href="#fluentd架构" aria-hidden="true">#</a> Fluentd架构</h6><p><img src="'+h+'" alt=""></p><p>为什么推荐使用fluentd作为k8s体系的日志收集工具？</p><ul><li><p>云原生：https://github.com/kubernetes/kubernetes/tree/master/cluster/addons/fluentd-elasticsearch</p></li><li><p>将日志文件JSON化</p><p><img src="'+_+'" alt=""></p></li><li><p>可插拔架构设计</p><p><img src="'+f+'" alt=""></p></li><li><p>极小的资源占用</p><p>基于C和Ruby语言， 30-40MB，13,000 events/second/core</p><p><img src="'+y+`" alt=""></p></li><li><p>极强的可靠性</p><ul><li>基于内存和本地文件的缓存</li><li>强大的故障转移</li></ul></li></ul><h6 id="fluentd事件流的生命周期及指令配置" tabindex="-1"><a class="header-anchor" href="#fluentd事件流的生命周期及指令配置" aria-hidden="true">#</a> fluentd事件流的生命周期及指令配置</h6><p>https://docs.fluentd.org/v/0.12/quickstart/life-of-a-fluentd-event</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>Input <span class="token operator">-</span>&gt; <span class="token keyword">filter</span> 1 <span class="token operator">-</span>&gt; <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> <span class="token operator">-</span>&gt; <span class="token keyword">filter</span> N <span class="token operator">-</span>&gt; Buffer <span class="token operator">-</span>&gt; Output
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>启动命令</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ fluentd <span class="token operator">-</span>c fluent<span class="token punctuation">.</span>conf
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>指令介绍：</p>`,11),U={href:"https://docs.fluentd.org/v/0.12/input",target:"_blank",rel:"noopener noreferrer"},O=t(`<div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>&lt;source&gt;
  @<span class="token function">type</span> tail
  path <span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>log/httpd-access<span class="token punctuation">.</span>log
  pos_file <span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>log/td-agent/httpd-access<span class="token punctuation">.</span>log<span class="token punctuation">.</span>pos
  tag myapp<span class="token punctuation">.</span>access
  format apache2
&lt;<span class="token operator">/</span>source&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1),B=t(`<li><p>filter，Event processing pipeline（事件处理流）</p><p>filter 可以串联成 pipeline，对数据进行串行处理，最终再交给 match 输出。 如下可以对事件内容进行处理：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>&lt;source&gt;
  @<span class="token function">type</span> http
  port 9880
&lt;<span class="token operator">/</span>source&gt;

&lt;<span class="token keyword">filter</span> myapp<span class="token punctuation">.</span>access&gt;
  @<span class="token function">type</span> record_transformer
  &lt;record&gt;
    host_param “<span class="token comment">#{Socket.gethostname}”</span>
  &lt;<span class="token operator">/</span>record&gt;
&lt;<span class="token operator">/</span><span class="token keyword">filter</span>&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>filter 获取数据后，调用内置的 @type record_transformer 插件，在事件的 record 里插入了新的字段 host_param，然后再交给 match 输出。</p></li><li><p>label指令</p><p>可以在 <code>source</code> 里指定 <code>@label</code>，这个 source 所触发的事件就会被发送给指定的 label 所包含的任务，而不会被后续的其他任务获取到。</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code>&lt;source<span class="token punctuation">&gt;</span>
  @type forward
&lt;/source<span class="token punctuation">&gt;</span>

&lt;source<span class="token punctuation">&gt;</span>
<span class="token comment">### 这个任务指定了 label 为 @SYSTEM</span>
<span class="token comment">### 会被发送给 &lt;label @SYSTEM&gt;</span>
<span class="token comment">### 而不会被发送给下面紧跟的 filter 和 match</span>
  @type tail
  @label @SYSTEM
  path /var/log/httpd<span class="token punctuation">-</span>access.log
  pos_file /var/log/td<span class="token punctuation">-</span>agent/httpd<span class="token punctuation">-</span>access.log.pos
  tag myapp.access
  format apache2
&lt;/source<span class="token punctuation">&gt;</span>

&lt;filter access.<span class="token important">**&gt;</span>
  @type record_transformer
  &lt;record<span class="token punctuation">&gt;</span>
  <span class="token comment"># …</span>
  &lt;/record<span class="token punctuation">&gt;</span>
&lt;/filter<span class="token punctuation">&gt;</span>

&lt;match <span class="token important">**&gt;</span>
  @type elasticsearch
  <span class="token comment"># …</span>
&lt;/match<span class="token punctuation">&gt;</span>

&lt;label @SYSTEM<span class="token punctuation">&gt;</span>
  <span class="token comment">### 将会接收到上面 @type tail 的 source event</span>
  &lt;filter var.log.middleware.<span class="token important">**&gt;</span>
    @type grep
    <span class="token comment"># …</span>
  &lt;/filter<span class="token punctuation">&gt;</span>

  &lt;match <span class="token important">**&gt;</span>
    @type s3
    <span class="token comment"># …</span>
  &lt;/match<span class="token punctuation">&gt;</span>
&lt;/label<span class="token punctuation">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>match，匹配输出</p><p>查找匹配 “tags” 的事件，并处理它们。match 命令的最常见用法是将事件输出到其他系统（因此，与 match 命令对应的插件称为 “输出插件”）</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>&lt;source&gt;
  @<span class="token function">type</span> http
  port 9880
&lt;<span class="token operator">/</span>source&gt;

&lt;<span class="token keyword">filter</span> myapp<span class="token punctuation">.</span>access&gt;
  @<span class="token function">type</span> record_transformer
  &lt;record&gt;
    host_param “<span class="token comment">#{Socket.gethostname}”</span>
  &lt;<span class="token operator">/</span>record&gt;
&lt;<span class="token operator">/</span><span class="token keyword">filter</span>&gt;

&lt;match myapp<span class="token punctuation">.</span>access&gt;
  @<span class="token function">type</span> file
  path <span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>log/fluent/access
&lt;<span class="token operator">/</span>match&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>`,3),H=t(`<p>事件的结构：</p><p>time：事件的处理时间</p><p>tag：事件的来源，在fluentd.conf中配置</p><p>record：真实的日志内容，json对象</p><p>比如，下面这条原始日志：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code>192.168.0.1 <span class="token punctuation">-</span> <span class="token punctuation">-</span> <span class="token punctuation">[</span>28/Feb/2013<span class="token punctuation">:</span>12<span class="token punctuation">:</span>00<span class="token punctuation">:</span>00 +0900<span class="token punctuation">]</span> &quot;GET / HTTP/1.1&quot; 200 777
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>经过fluentd 引擎处理完后的样子可能是：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>2020-07-16 08:40:35 <span class="token operator">+</span>0000 apache<span class="token punctuation">.</span>access: <span class="token punctuation">{</span><span class="token string">&quot;user&quot;</span>:<span class="token string">&quot;-&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;method&quot;</span>:<span class="token string">&quot;GET&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;code&quot;</span>:200<span class="token punctuation">,</span><span class="token string">&quot;size&quot;</span>:777<span class="token punctuation">,</span><span class="token string">&quot;host&quot;</span>:<span class="token string">&quot;192.168.0.1&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;path&quot;</span>:<span class="token string">&quot;/&quot;</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h6 id="fluentd的buffer事件缓冲模型" tabindex="-1"><a class="header-anchor" href="#fluentd的buffer事件缓冲模型" aria-hidden="true">#</a> fluentd的buffer事件缓冲模型</h6><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>Input <span class="token operator">-</span>&gt; <span class="token keyword">filter</span> 1 <span class="token operator">-</span>&gt; <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> <span class="token operator">-</span>&gt; <span class="token keyword">filter</span> N <span class="token operator">-</span>&gt; Buffer <span class="token operator">-</span>&gt; Output
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="`+q+`" alt=""></p><p>因为每个事件数据量通常很小，考虑数据传输效率、稳定性等方面的原因，所以基本不会每条事件处理完后都会立马写入到output端，因此fluentd建立了缓冲模型，模型中主要有两个概念：</p><ul><li>buffer_chunk：事件缓冲块，用来存储本地已经处理完待发送至目的端的事件，可以设置每个块的大小。</li><li>buffer_queue：存储chunk的队列，可以设置长度</li></ul><p>可以设置的参数，主要有：</p><ul><li>buffer_type，缓冲类型，可以设置file或者memory</li><li>buffer_chunk_limit，每个chunk块的大小，默认8MB</li><li>buffer_queue_limit ，chunk块队列的最大长度，默认256</li><li>flush_interval ，flush一个chunk的时间间隔</li><li>retry_limit ，chunk块发送失败重试次数，默认17次，之后就丢弃该chunk数据</li><li>retry_wait ，重试发送chunk数据的时间间隔，默认1s，第2次失败再发送的话，间隔2s，下次4秒，以此类推</li></ul><p>大致的过程为：</p><p>随着fluentd事件的不断生成并写入chunk，缓存块持变大，当缓存块满足buffer_chunk_limit大小或者新的缓存块诞生超过flush_interval时间间隔后，会推入缓存queue队列尾部，该队列大小由buffer_queue_limit决定。</p><p>每次有新的chunk入列，位于队列最前部的chunk块会立即写入配置的存储后端，比如配置的是kafka，则立即把数据推入kafka中。</p><p>比较理想的情况是每次有新的缓存块进入缓存队列，则立马会被写入到后端，同时，新缓存块也持续入列，但是入列的速度不会快于出列的速度，这样基本上缓存队列处于空的状态，队列中最多只有一个缓存块。</p><p>但是实际情况考虑网络等因素，往往缓存块被写入后端存储的时候会出现延迟或者写入失败的情况，当缓存块写入后端失败时，该缓存块还会留在队列中，等retry_wait时间后重试发送，当retry的次数达到retry_limit后，该缓存块被销毁（数据被丢弃）。</p><p>此时缓存队列持续有新的缓存块进来，如果队列中存在很多未及时写入到后端存储的缓存块的话，当队列长度达到buffer_queue_limit大小，则新的事件被拒绝，fluentd报错，error_class=Fluent::Plugin::Buffer::BufferOverflowError error=&quot;buffer space has too many data&quot;。</p><p>还有一种情况是网络传输缓慢的情况，若每3秒钟会产生一个新块，但是写入到后端时间却达到了30s钟，队列长度为100，那么每个块出列的时间内，又有新的10个块进来，那么队列很快就会被占满，导致异常出现。</p><h6 id="实践一-实现业务应用日志的收集及字段解析" tabindex="-1"><a class="header-anchor" href="#实践一-实现业务应用日志的收集及字段解析" aria-hidden="true">#</a> 实践一：实现业务应用日志的收集及字段解析</h6><p>目标：收集容器内的nginx应用的access.log日志，并解析日志字段为JSON格式，原始日志的格式为：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ tail <span class="token operator">-</span>f access<span class="token punctuation">.</span>log
<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
53<span class="token punctuation">.</span>49<span class="token punctuation">.</span>146<span class="token punctuation">.</span>149 1561620585<span class="token punctuation">.</span>973 0<span class="token punctuation">.</span>005 502 <span class="token punctuation">[</span>27/Jun/2019:15:29:45 <span class="token operator">+</span>0800<span class="token punctuation">]</span> 178<span class="token punctuation">.</span>73<span class="token punctuation">.</span>215<span class="token punctuation">.</span>171 33337 GET https
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>收集并处理成：</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
    <span class="token property">&quot;serverIp&quot;</span><span class="token operator">:</span> <span class="token string">&quot;53.49.146.149&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;timestamp&quot;</span><span class="token operator">:</span> <span class="token string">&quot;1561620585.973&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;respondTime&quot;</span><span class="token operator">:</span> <span class="token string">&quot;0.005&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;httpCode&quot;</span><span class="token operator">:</span> <span class="token string">&quot;502&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;eventTime&quot;</span><span class="token operator">:</span> <span class="token string">&quot;27/Jun/2019:15:29:45 +0800&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;clientIp&quot;</span><span class="token operator">:</span> <span class="token string">&quot;178.73.215.171&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;clientPort&quot;</span><span class="token operator">:</span> <span class="token string">&quot;33337&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;method&quot;</span><span class="token operator">:</span> <span class="token string">&quot;GET&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;protocol&quot;</span><span class="token operator">:</span> <span class="token string">&quot;https&quot;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>思路：</p><ul><li>配置fluent.conf <ul><li>使用@tail插件通过监听access.log文件</li><li>用filter实现对nginx日志格式解析</li></ul></li><li>启动fluentd服务</li><li>手动追加内容至access.log文件</li><li>观察本地输出内容是否符合预期</li></ul><p><code>fluent.conf</code></p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>&lt;source&gt;
	@<span class="token function">type</span> tail
	@label @nginx_access
	path <span class="token operator">/</span>fluentd/access<span class="token punctuation">.</span>log
	pos_file <span class="token operator">/</span>fluentd/nginx_access<span class="token punctuation">.</span>posg
	tag nginx_access
	format none
	@log_level trace
&lt;<span class="token operator">/</span>source&gt;
&lt;label @nginx_access&gt;
   &lt;<span class="token keyword">filter</span>  nginx_access&gt;
       @<span class="token function">type</span> parser
	   key_name message
	   format  <span class="token operator">/</span><span class="token punctuation">(</span>?&lt;serverIp&gt;<span class="token punctuation">[</span>^ <span class="token punctuation">]</span><span class="token operator">*</span><span class="token punctuation">)</span> <span class="token punctuation">(</span>?&lt;timestamp&gt;<span class="token punctuation">[</span>^ <span class="token punctuation">]</span><span class="token operator">*</span><span class="token punctuation">)</span> <span class="token punctuation">(</span>?&lt;respondTime&gt;<span class="token punctuation">[</span>^ <span class="token punctuation">]</span><span class="token operator">*</span><span class="token punctuation">)</span> <span class="token punctuation">(</span>?&lt;httpCode&gt;<span class="token punctuation">[</span>^ <span class="token punctuation">]</span><span class="token operator">*</span><span class="token punctuation">)</span> \\<span class="token punctuation">[</span><span class="token punctuation">(</span>?&lt;eventTime&gt;<span class="token punctuation">[</span>^\\<span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token operator">*</span><span class="token punctuation">)</span>\\<span class="token punctuation">]</span> <span class="token punctuation">(</span>?&lt;clientIp&gt;<span class="token punctuation">[</span>^ <span class="token punctuation">]</span><span class="token operator">*</span><span class="token punctuation">)</span> <span class="token punctuation">(</span>?&lt;clientPort&gt;<span class="token punctuation">[</span>^ <span class="token punctuation">]</span><span class="token operator">*</span><span class="token punctuation">)</span> <span class="token punctuation">(</span>?&lt;method&gt;<span class="token punctuation">[</span>^ <span class="token punctuation">]</span><span class="token operator">*</span><span class="token punctuation">)</span> <span class="token punctuation">(</span>?&lt;protocol&gt;<span class="token punctuation">[</span>^ <span class="token punctuation">]</span><span class="token operator">*</span><span class="token punctuation">)</span><span class="token operator">/</span>
   &lt;<span class="token operator">/</span><span class="token keyword">filter</span>&gt;
   &lt;match  nginx_access&gt;
     @<span class="token function">type</span> stdout
   &lt;<span class="token operator">/</span>match&gt;
&lt;<span class="token operator">/</span>label&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>启动服务，追加文件内容：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ docker run <span class="token operator">-</span>u root <span class="token operator">--</span><span class="token function">rm</span> <span class="token operator">-</span>ti 172<span class="token punctuation">.</span>21<span class="token punctuation">.</span>51<span class="token punctuation">.</span>67:5000/fluentd_elasticsearch/fluentd:v2<span class="token punctuation">.</span>5<span class="token punctuation">.</span>2 sh
<span class="token operator">/</span> <span class="token comment"># cd /fluentd/</span>
<span class="token operator">/</span> <span class="token comment"># touch access.log</span>
<span class="token operator">/</span> <span class="token comment"># fluentd -c /fluentd/etc/fluent.conf</span>
<span class="token operator">/</span> <span class="token comment"># echo &#39;53.49.146.149 1561620585.973 0.005 502 [27/Jun/2019:15:29:45 +0800] 178.73.215.171 33337 GET https&#39; &gt;&gt;/fluentd/access.log</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,33),Y={href:"http://fluentular.herokuapp.com/",target:"_blank",rel:"noopener noreferrer"},F=t(`<h6 id="实践二-使用ruby实现日志字段的转换及自定义处理" tabindex="-1"><a class="header-anchor" href="#实践二-使用ruby实现日志字段的转换及自定义处理" aria-hidden="true">#</a> 实践二：使用ruby实现日志字段的转换及自定义处理</h6><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>&lt;source&gt;
	@<span class="token function">type</span> tail
	@label @nginx_access
	path <span class="token operator">/</span>fluentd/access<span class="token punctuation">.</span>log
	pos_file <span class="token operator">/</span>fluentd/nginx_access<span class="token punctuation">.</span>posg
	tag nginx_access
	format none
	@log_level trace
&lt;<span class="token operator">/</span>source&gt;
&lt;label @nginx_access&gt;
   &lt;<span class="token keyword">filter</span>  nginx_access&gt;
       @<span class="token function">type</span> parser
	   key_name message
	   format  <span class="token operator">/</span><span class="token punctuation">(</span>?&lt;serverIp&gt;<span class="token punctuation">[</span>^ <span class="token punctuation">]</span><span class="token operator">*</span><span class="token punctuation">)</span> <span class="token punctuation">(</span>?&lt;timestamp&gt;<span class="token punctuation">[</span>^ <span class="token punctuation">]</span><span class="token operator">*</span><span class="token punctuation">)</span> <span class="token punctuation">(</span>?&lt;respondTime&gt;<span class="token punctuation">[</span>^ <span class="token punctuation">]</span><span class="token operator">*</span><span class="token punctuation">)</span> <span class="token punctuation">(</span>?&lt;httpCode&gt;<span class="token punctuation">[</span>^ <span class="token punctuation">]</span><span class="token operator">*</span><span class="token punctuation">)</span> \\<span class="token punctuation">[</span><span class="token punctuation">(</span>?&lt;eventTime&gt;<span class="token punctuation">[</span>^\\<span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token operator">*</span><span class="token punctuation">)</span>\\<span class="token punctuation">]</span> <span class="token punctuation">(</span>?&lt;clientIp&gt;<span class="token punctuation">[</span>^ <span class="token punctuation">]</span><span class="token operator">*</span><span class="token punctuation">)</span> <span class="token punctuation">(</span>?&lt;clientPort&gt;<span class="token punctuation">[</span>^ <span class="token punctuation">]</span><span class="token operator">*</span><span class="token punctuation">)</span> <span class="token punctuation">(</span>?&lt;method&gt;<span class="token punctuation">[</span>^ <span class="token punctuation">]</span><span class="token operator">*</span><span class="token punctuation">)</span> <span class="token punctuation">(</span>?&lt;protocol&gt;<span class="token punctuation">[</span>^ <span class="token punctuation">]</span><span class="token operator">*</span><span class="token punctuation">)</span><span class="token operator">/</span>
   &lt;<span class="token operator">/</span><span class="token keyword">filter</span>&gt;
   &lt;<span class="token keyword">filter</span>  nginx_access&gt;   
	   @<span class="token function">type</span> record_transformer
	   enable_ruby
       &lt;record&gt;
		host_name <span class="token string">&quot;#{Socket.gethostname}&quot;</span>
        my_key  <span class="token string">&quot;my_val&quot;</span>
        tls $<span class="token punctuation">{</span>record<span class="token punctuation">[</span><span class="token string">&quot;protocol&quot;</span><span class="token punctuation">]</span><span class="token punctuation">.</span>index<span class="token punctuation">(</span><span class="token string">&quot;https&quot;</span><span class="token punctuation">)</span> ? <span class="token string">&quot;true&quot;</span> : <span class="token string">&quot;false&quot;</span><span class="token punctuation">}</span>
       &lt;<span class="token operator">/</span>record&gt;
   &lt;<span class="token operator">/</span><span class="token keyword">filter</span>&gt;
   &lt;match  nginx_access&gt;
     @<span class="token function">type</span> stdout
   &lt;<span class="token operator">/</span>match&gt;
&lt;<span class="token operator">/</span>label&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="configmap的配置文件挂载使用场景" tabindex="-1"><a class="header-anchor" href="#configmap的配置文件挂载使用场景" aria-hidden="true">#</a> ConfigMap的配置文件挂载使用场景</h5><p>开始之前，我们先来回顾一下，configmap的常用的挂载场景。</p><h6 id="场景一-单文件挂载到空目录" tabindex="-1"><a class="header-anchor" href="#场景一-单文件挂载到空目录" aria-hidden="true">#</a> 场景一：单文件挂载到空目录</h6><p>假如业务应用有一个配置文件，名为 <code>application-1.conf</code>，如果想将此配置挂载到pod的<code>/etc/application/</code>目录中。</p><p><code>application-1.conf</code>的内容为：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ <span class="token function">cat</span> application-1<span class="token punctuation">.</span>conf
name: <span class="token string">&quot;application&quot;</span>
platform: <span class="token string">&quot;linux&quot;</span>
purpose: <span class="token string">&quot;demo&quot;</span>
company: <span class="token string">&quot;nohi&quot;</span>
version: <span class="token string">&quot;v2.1.0&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>该配置文件在k8s中可以通过configmap来管理，通常我们有如下两种方式来管理配置文件：</p><ul><li><p>通过kubectl命令行来生成configmap</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token comment"># 通过文件直接创建</span>
$ kubectl <span class="token operator">-</span>n default create configmap application-config <span class="token operator">--</span><span class="token keyword">from</span><span class="token operator">-</span>file=application-1<span class="token punctuation">.</span>conf

<span class="token comment"># 会生成配置文件，查看内容，configmap的key为文件名字</span>
$ kubectl <span class="token operator">-</span>n default get cm application-config <span class="token operator">-</span>oyaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>通过yaml文件直接创建</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ <span class="token function">cat</span> application-config<span class="token punctuation">.</span>yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: application-config
  namespace: default
<span class="token keyword">data</span>:
  application-1<span class="token punctuation">.</span>conf: <span class="token punctuation">|</span>
    name: <span class="token string">&quot;application&quot;</span>
    platform: <span class="token string">&quot;linux&quot;</span>
    purpose: <span class="token string">&quot;demo&quot;</span>
    company: <span class="token string">&quot;nohi&quot;</span>
    version: <span class="token string">&quot;v2.1.0&quot;</span>

<span class="token comment"># 创建configmap</span>
$ kubectl create <span class="token operator">-</span>f application-config<span class="token punctuation">.</span>yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><p>准备一个<code>demo-deployment.yaml</code>文件，挂载上述configmap到<code>/etc/application/</code>中</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ <span class="token function">cat</span> demo-deployment<span class="token punctuation">.</span>yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: demo
  namespace: default
spec:
  selector:
    matchLabels:
      app: demo
  template:
    metadata:
      labels:
        app: demo
    spec:
      volumes:
      <span class="token operator">-</span> configMap:
          name: application-config
        name: config
      containers:
      <span class="token operator">-</span> name: nginx
        image: nginx:alpine
        imagePullPolicy: IfNotPresent
        volumeMounts:
        <span class="token operator">-</span> mountPath: <span class="token string">&quot;/etc/application&quot;</span>
          name: config
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>创建并查看：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ kubectl create <span class="token operator">-</span>f demo-deployment<span class="token punctuation">.</span>yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>修改configmap文件的内容，观察pod中是否自动感知变化：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ kubectl edit cm application-config
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><blockquote><p>整个configmap文件直接挂载到pod中，若configmap变化，pod会自动感知并拉取到pod内部。</p><p>但是pod内的进程不会自动重启，所以很多服务会实现一个内部的reload接口，用来加载最新的配置文件到进程中。</p></blockquote><h6 id="场景二-多文件挂载" tabindex="-1"><a class="header-anchor" href="#场景二-多文件挂载" aria-hidden="true">#</a> 场景二：多文件挂载</h6><p>假如有多个配置文件，都需要挂载到pod内部，且都在一个目录中</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ <span class="token function">cat</span> application-1<span class="token punctuation">.</span>conf
name: <span class="token string">&quot;application-1&quot;</span>
platform: <span class="token string">&quot;linux&quot;</span>
purpose: <span class="token string">&quot;demo&quot;</span>
company: <span class="token string">&quot;nohi&quot;</span>
version: <span class="token string">&quot;v2.1.0&quot;</span>
$ <span class="token function">cat</span> application-2<span class="token punctuation">.</span>conf
name: <span class="token string">&quot;application-2&quot;</span>
platform: <span class="token string">&quot;linux&quot;</span>
purpose: <span class="token string">&quot;demo&quot;</span>
company: <span class="token string">&quot;nohi&quot;</span>
version: <span class="token string">&quot;v2.1.0&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>同样可以使用两种方式创建：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ kubectl delete cm application-config

$ kubectl create cm application-config <span class="token operator">--</span><span class="token keyword">from</span><span class="token operator">-</span>file=application-1<span class="token punctuation">.</span>conf <span class="token operator">--</span><span class="token keyword">from</span><span class="token operator">-</span>file=application-2<span class="token punctuation">.</span>conf

$ kubectl get cm application-config <span class="token operator">-</span>oyaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>观察Pod已经自动获取到最新的变化</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ kubectl exec demo-55c649865b-gpkgk <span class="token function">ls</span> <span class="token operator">/</span>etc/application/
application-1<span class="token punctuation">.</span>conf
application-2<span class="token punctuation">.</span>conf
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时，是挂载到pod内的空目录中<code>/etc/application</code>，假如想挂载到pod已存在的目录中，比如：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$  kubectl exec   demo-55c649865b-gpkgk <span class="token function">ls</span> <span class="token operator">/</span>etc/profile<span class="token punctuation">.</span>d
color_prompt
locale
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>更改deployment的挂载目录：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ <span class="token function">cat</span> demo-deployment<span class="token punctuation">.</span>yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: demo
  namespace: default
spec:
  selector:
    matchLabels:
      app: demo
  template:
    metadata:
      labels:
        app: demo
    spec:
      volumes:
      <span class="token operator">-</span> configMap:
          name: application-config
        name: config
      containers:
      <span class="token operator">-</span> name: nginx
        image: nginx:alpine
        imagePullPolicy: IfNotPresent
        volumeMounts:
        <span class="token operator">-</span> mountPath: <span class="token string">&quot;/etc/profile.d&quot;</span>
          name: config
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>重建pod</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ kubectl apply <span class="token operator">-</span>f demo-deployment<span class="token punctuation">.</span>yaml

<span class="token comment"># 查看pod内的/etc/profile.d目录，发现已有文件被覆盖</span>
$ kubectl exec demo-77d685b9f7-68qz7 <span class="token function">ls</span> <span class="token operator">/</span>etc/profile<span class="token punctuation">.</span>d
application-1<span class="token punctuation">.</span>conf
application-2<span class="token punctuation">.</span>conf
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="场景三-挂载子路径" tabindex="-1"><a class="header-anchor" href="#场景三-挂载子路径" aria-hidden="true">#</a> 场景三 挂载子路径</h6><p>实现多个配置文件，可以挂载到pod内的不同的目录中。比如：</p><ul><li><code>application-1.conf</code>挂载到<code>/etc/application/</code></li><li><code>application-2.conf</code>挂载到<code>/etc/profile.d</code></li></ul><p>configmap保持不变，修改deployment文件：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ <span class="token function">cat</span> demo-deployment<span class="token punctuation">.</span>yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: demo
  namespace: default
spec:
  selector:
    matchLabels:
      app: demo
  template:
    metadata:
      labels:
        app: demo
    spec:
      volumes:
      <span class="token operator">-</span> name: config
        configMap:
          name: application-config
          items:
          <span class="token operator">-</span> key: application-1<span class="token punctuation">.</span>conf
            path: application1
          <span class="token operator">-</span> key: application-2<span class="token punctuation">.</span>conf
            path: application2
      containers:
      <span class="token operator">-</span> name: nginx
        image: nginx:alpine
        imagePullPolicy: IfNotPresent
        volumeMounts:
        <span class="token operator">-</span> mountPath: <span class="token string">&quot;/etc/application/application-1.conf&quot;</span>
          name: config
          subPath: application1
        <span class="token operator">-</span> mountPath: <span class="token string">&quot;/etc/profile.d/application-2.conf&quot;</span>
          name: config
          subPath: application2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试挂载：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ kubectl apply <span class="token operator">-</span>f demo-deployment<span class="token punctuation">.</span>yaml

$ kubectl exec demo-78489c754-shjhz <span class="token function">ls</span> <span class="token operator">/</span>etc/application
application-1<span class="token punctuation">.</span>conf

$ kubectl exec demo-78489c754-shjhz <span class="token function">ls</span> <span class="token operator">/</span>etc/profile<span class="token punctuation">.</span>d/
application-2<span class="token punctuation">.</span>conf
color_prompt
locale

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>使用subPath挂载到Pod内部的文件，不会自动感知原有ConfigMap的变更</p></blockquote><h5 id="部署es服务" tabindex="-1"><a class="header-anchor" href="#部署es服务" aria-hidden="true">#</a> 部署es服务</h5><h6 id="部署分析" tabindex="-1"><a class="header-anchor" href="#部署分析" aria-hidden="true">#</a> 部署分析</h6><ol><li>es生产环境是部署es集群，通常会使用statefulset进行部署</li><li>es默认使用elasticsearch用户启动进程，es的数据目录是通过宿主机的路径挂载，因此目录权限被主机的目录权限覆盖，因此可以利用initContainer容器在es进程启动之前把目录的权限修改掉，注意init container要用特权模式启动。</li><li>若希望使用helm部署，参考 https://github.com/helm/charts/tree/master/stable/elasticsearch</li></ol><h6 id="使用statefulset管理有状态服务" tabindex="-1"><a class="header-anchor" href="#使用statefulset管理有状态服务" aria-hidden="true">#</a> 使用StatefulSet管理有状态服务</h6><p>使用Deployment创建多副本的pod的情况：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># 01-nginx-deployment.yaml</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>deployment
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> default
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>deployment
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">3</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>deployment
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">labels</span><span class="token punctuation">:</span>
        <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>deployment
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx
        <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx<span class="token punctuation">:</span>alpine
        <span class="token key atrule">ports</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">80</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用StatefulSet创建多副本pod的情况：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment">#02-statefulset.yaml</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> StatefulSet
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>statefulset
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> default
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>sts
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">3</span>
  <span class="token key atrule">serviceName</span><span class="token punctuation">:</span> <span class="token string">&quot;nginx&quot;</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>sts
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">labels</span><span class="token punctuation">:</span>
        <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>sts
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx
        <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx<span class="token punctuation">:</span>alpine
        <span class="token key atrule">ports</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">80</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>无头服务Headless Service</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> default
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>sts
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">protocol</span><span class="token punctuation">:</span> TCP
    <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">80</span>
    <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">80</span>
  <span class="token key atrule">clusterIP</span><span class="token punctuation">:</span> None
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ kubectl <span class="token operator">-</span>n default exec  <span class="token operator">-</span>ti nginx-statefulset-0 sh
<span class="token operator">/</span> <span class="token comment"># curl nginx-statefulset-2.nginx</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="部署并验证" tabindex="-1"><a class="header-anchor" href="#部署并验证" aria-hidden="true">#</a> 部署并验证</h6><ul><li><p>20230226 按视频教程部署es，一直报<code>Back-off restarting failed container fix-permissions in pod elasticsearch-0_logging</code></p></li><li><p>20230226 参见：https://blog.csdn.net/make_progress/article/details/124638272</p></li></ul><p><code>es-config.yaml</code></p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ConfigMap
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> es<span class="token punctuation">-</span>config
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> logging
<span class="token key atrule">data</span><span class="token punctuation">:</span>
  <span class="token key atrule">elasticsearch.yml</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string">
    cluster.name: &quot;nohi-elasticsearch&quot;
    node.name: &quot;\${POD_NAME}&quot;
    network.host: 0.0.0.0
    discovery.seed_hosts: &quot;es-svc-headless&quot;
    cluster.initial_master_nodes: &quot;elasticsearch-0,elasticsearch-1,elasticsearch-2&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>es-svc-headless.yaml</code></p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> es<span class="token punctuation">-</span>svc<span class="token punctuation">-</span>headless
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> logging
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">k8s-app</span><span class="token punctuation">:</span> elasticsearch
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">k8s-app</span><span class="token punctuation">:</span> elasticsearch
  <span class="token key atrule">clusterIP</span><span class="token punctuation">:</span> None
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> in
    <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">9300</span>
    <span class="token key atrule">protocol</span><span class="token punctuation">:</span> TCP
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>es-statefulset.yaml</code></p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> StatefulSet
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> elasticsearch
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> logging
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">k8s-app</span><span class="token punctuation">:</span> elasticsearch
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">3</span>
  <span class="token key atrule">serviceName</span><span class="token punctuation">:</span> es<span class="token punctuation">-</span>svc<span class="token punctuation">-</span>headless
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">k8s-app</span><span class="token punctuation">:</span> elasticsearch
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">labels</span><span class="token punctuation">:</span>
        <span class="token key atrule">k8s-app</span><span class="token punctuation">:</span> elasticsearch
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">initContainers</span><span class="token punctuation">:</span>  
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> increase<span class="token punctuation">-</span>vm<span class="token punctuation">-</span>max<span class="token punctuation">-</span>map
        <span class="token key atrule">image</span><span class="token punctuation">:</span> busybox<span class="token punctuation">:</span><span class="token number">1.32</span>
        <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;sysctl&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;-w&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;vm.max_map_count=262144&quot;</span><span class="token punctuation">]</span>
        <span class="token key atrule">securityContext</span><span class="token punctuation">:</span>
          <span class="token key atrule">privileged</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> increase<span class="token punctuation">-</span>fd<span class="token punctuation">-</span>ulimit
        <span class="token key atrule">image</span><span class="token punctuation">:</span> busybox<span class="token punctuation">:</span><span class="token number">1.32</span>
        <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;sh&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;-c&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;ulimit -n 65536&quot;</span><span class="token punctuation">]</span>
        <span class="token key atrule">securityContext</span><span class="token punctuation">:</span>
          <span class="token key atrule">privileged</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> elasticsearch
        <span class="token comment">#image: elasticsearch:8.6.2</span>
        <span class="token key atrule">image</span><span class="token punctuation">:</span> 10.0.0.181<span class="token punctuation">:</span>5000/elasticsearch<span class="token punctuation">:</span>8.6.2
        <span class="token key atrule">env</span><span class="token punctuation">:</span>
          <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> POD_NAME
            <span class="token key atrule">valueFrom</span><span class="token punctuation">:</span>
              <span class="token key atrule">fieldRef</span><span class="token punctuation">:</span>
                <span class="token key atrule">fieldPath</span><span class="token punctuation">:</span> metadata.name
          <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> xpack.security.enabled
            <span class="token key atrule">value</span><span class="token punctuation">:</span> <span class="token string">&quot;false&quot;</span>
        <span class="token key atrule">resources</span><span class="token punctuation">:</span>
          <span class="token key atrule">limits</span><span class="token punctuation">:</span>
            <span class="token key atrule">cpu</span><span class="token punctuation">:</span> <span class="token string">&#39;1&#39;</span>
            <span class="token key atrule">memory</span><span class="token punctuation">:</span> 2Gi
          <span class="token key atrule">requests</span><span class="token punctuation">:</span>
            <span class="token key atrule">cpu</span><span class="token punctuation">:</span> <span class="token string">&#39;1&#39;</span>
            <span class="token key atrule">memory</span><span class="token punctuation">:</span> 2Gi
        <span class="token key atrule">ports</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">9200</span>
          <span class="token key atrule">name</span><span class="token punctuation">:</span> db
          <span class="token key atrule">protocol</span><span class="token punctuation">:</span> TCP
        <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">9300</span>
          <span class="token key atrule">name</span><span class="token punctuation">:</span> transport
          <span class="token key atrule">protocol</span><span class="token punctuation">:</span> TCP
        <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span>
          <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> es<span class="token punctuation">-</span>config<span class="token punctuation">-</span>volume
            <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /usr/share/elasticsearch/config/elasticsearch.yml
            <span class="token key atrule">subPath</span><span class="token punctuation">:</span> elasticsearch.yml
          <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> es<span class="token punctuation">-</span>data<span class="token punctuation">-</span>volume
            <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /usr/share/elasticsearch/data
      <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> es<span class="token punctuation">-</span>config<span class="token punctuation">-</span>volume
          <span class="token key atrule">configMap</span><span class="token punctuation">:</span>
            <span class="token key atrule">name</span><span class="token punctuation">:</span> es<span class="token punctuation">-</span>config
            <span class="token key atrule">items</span><span class="token punctuation">:</span>
            <span class="token punctuation">-</span> <span class="token key atrule">key</span><span class="token punctuation">:</span> elasticsearch.yml
              <span class="token key atrule">path</span><span class="token punctuation">:</span> elasticsearch.yml
  <span class="token key atrule">volumeClaimTemplates</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">name</span><span class="token punctuation">:</span> es<span class="token punctuation">-</span>data<span class="token punctuation">-</span>volume
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">accessModes</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;ReadWriteOnce&quot;</span><span class="token punctuation">]</span>
      <span class="token key atrule">storageClassName</span><span class="token punctuation">:</span> <span class="token string">&quot;nfs-data-logging&quot;</span>
      <span class="token key atrule">resources</span><span class="token punctuation">:</span>
        <span class="token key atrule">requests</span><span class="token punctuation">:</span>
          <span class="token key atrule">storage</span><span class="token punctuation">:</span> 5Gi
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>es-svc.yaml</code></p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> es<span class="token punctuation">-</span>svc
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> logging
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">k8s-app</span><span class="token punctuation">:</span> elasticsearch
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">k8s-app</span><span class="token punctuation">:</span> elasticsearch
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> out
    <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">9200</span>
    <span class="token key atrule">protocol</span><span class="token punctuation">:</span> TCP
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ kubectl create namespace logging

<span class="token comment">## 部署服务</span>
$ kubectl create <span class="token operator">-</span>f es-config<span class="token punctuation">.</span>yaml
$ kubectl create <span class="token operator">-</span>f es-svc-headless<span class="token punctuation">.</span>yaml
$ kubectl create <span class="token operator">-</span>f es-statefulset<span class="token punctuation">.</span>yaml
$ kubectl create <span class="token operator">-</span>f es-svc<span class="token punctuation">.</span>yaml

<span class="token comment">## 等待片刻，查看一下es的pod部署到了k8s-worker1节点，状态变为running</span>
$ kubectl <span class="token operator">-</span>n logging get po <span class="token operator">-</span>o wide  
NAME              READY   STATUS    RESTARTS   AGE   IP  
elasticsearch-0   1/1     Running   0          15m   10<span class="token punctuation">.</span>244<span class="token punctuation">.</span>0<span class="token punctuation">.</span>126 
elasticsearch-1   1/1     Running   0          15m   10<span class="token punctuation">.</span>244<span class="token punctuation">.</span>0<span class="token punctuation">.</span>127
elasticsearch-2   1/1     Running   0          15m   10<span class="token punctuation">.</span>244<span class="token punctuation">.</span>0<span class="token punctuation">.</span>128
<span class="token comment"># 然后通过curl命令访问一下服务，验证es是否部署成功</span>
$ kubectl <span class="token operator">-</span>n logging get svc  
es-svc            ClusterIP   10<span class="token punctuation">.</span>104<span class="token punctuation">.</span>226<span class="token punctuation">.</span>175   &lt;none&gt;        9200/TCP   2s
es-svc-headless   ClusterIP   None             &lt;none&gt;        9300/TCP   32m 
$ curl 10<span class="token punctuation">.</span>104<span class="token punctuation">.</span>226<span class="token punctuation">.</span>175:9200
<span class="token punctuation">{</span>
  <span class="token string">&quot;name&quot;</span> : <span class="token string">&quot;elasticsearch-2&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;cluster_name&quot;</span> : <span class="token string">&quot;nohi-elasticsearch&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;cluster_uuid&quot;</span> : <span class="token string">&quot;7FDIACx9T-2ajYcB5qp4hQ&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;version&quot;</span> : <span class="token punctuation">{</span>
    <span class="token string">&quot;number&quot;</span> : <span class="token string">&quot;7.4.2&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;build_flavor&quot;</span> : <span class="token string">&quot;default&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;build_type&quot;</span> : <span class="token string">&quot;docker&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;build_hash&quot;</span> : <span class="token string">&quot;2f90bbf7b93631e52bafb59b3b049cb44ec25e96&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;build_date&quot;</span> : <span class="token string">&quot;2019-10-28T20:40:44.881551Z&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;build_snapshot&quot;</span> : false<span class="token punctuation">,</span>
    <span class="token string">&quot;lucene_version&quot;</span> : <span class="token string">&quot;8.2.0&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;minimum_wire_compatibility_version&quot;</span> : <span class="token string">&quot;6.8.0&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;minimum_index_compatibility_version&quot;</span> : <span class="token string">&quot;6.0.0-beta1&quot;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token string">&quot;tagline&quot;</span> : <span class="token string">&quot;You Know, for Search&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="部署kibana" tabindex="-1"><a class="header-anchor" href="#部署kibana" aria-hidden="true">#</a> 部署kibana</h5><h6 id="部署分析-1" tabindex="-1"><a class="header-anchor" href="#部署分析-1" aria-hidden="true">#</a> 部署分析</h6><ol><li><p>kibana需要暴露web页面给前端使用，因此使用ingress配置域名来实现对kibana的访问</p></li><li><p>kibana为无状态应用，直接使用Deployment来启动</p></li><li><p>kibana需要访问es，直接利用k8s服务发现访问此地址即可，http://es-svc:9200</p></li></ol><h6 id="部署并验证-1" tabindex="-1"><a class="header-anchor" href="#部署并验证-1" aria-hidden="true">#</a> 部署并验证</h6><p><code>efk/kibana.yaml</code></p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> kibana
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> logging
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> kibana
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> <span class="token string">&quot;kibana&quot;</span>
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">labels</span><span class="token punctuation">:</span>
        <span class="token key atrule">app</span><span class="token punctuation">:</span> kibana
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> kibana
        <span class="token comment">#image: kibana:8.6.2</span>
        <span class="token key atrule">image</span><span class="token punctuation">:</span> 10.0.0.181<span class="token punctuation">:</span>5000/kibana<span class="token punctuation">:</span>8.6.2
        <span class="token key atrule">resources</span><span class="token punctuation">:</span>
          <span class="token key atrule">limits</span><span class="token punctuation">:</span>
            <span class="token key atrule">cpu</span><span class="token punctuation">:</span> 1000m
          <span class="token key atrule">requests</span><span class="token punctuation">:</span>
            <span class="token key atrule">cpu</span><span class="token punctuation">:</span> 100m
        <span class="token key atrule">env</span><span class="token punctuation">:</span>
          <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> ELASTICSEARCH_HOSTS
            <span class="token key atrule">value</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//es<span class="token punctuation">-</span>svc<span class="token punctuation">:</span><span class="token number">9200</span>
          <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> SERVER_NAME
            <span class="token key atrule">value</span><span class="token punctuation">:</span> kibana<span class="token punctuation">-</span>logging
          <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> SERVER_REWRITEBASEPATH
            <span class="token key atrule">value</span><span class="token punctuation">:</span> <span class="token string">&quot;false&quot;</span>
        <span class="token key atrule">ports</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">5601</span>
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> kibana
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> logging
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> kibana
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">5601</span>
    <span class="token key atrule">protocol</span><span class="token punctuation">:</span> TCP
    <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">5601</span>
  <span class="token key atrule">type</span><span class="token punctuation">:</span> NodePort
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> kibana
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> networking.k8s.io/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Ingress
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> kibana
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> logging
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">rules</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> kibana.nohi.com
    <span class="token key atrule">http</span><span class="token punctuation">:</span>
      <span class="token key atrule">paths</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">path</span><span class="token punctuation">:</span> /
        <span class="token key atrule">pathType</span><span class="token punctuation">:</span> Prefix
        <span class="token key atrule">backend</span><span class="token punctuation">:</span>
          <span class="token key atrule">service</span><span class="token punctuation">:</span>
            <span class="token key atrule">name</span><span class="token punctuation">:</span> kibana
            <span class="token key atrule">port</span><span class="token punctuation">:</span>
              <span class="token key atrule">number</span><span class="token punctuation">:</span> <span class="token number">5601</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ kubectl create <span class="token operator">-</span>f kibana<span class="token punctuation">.</span>yaml  
deployment<span class="token punctuation">.</span>apps/kibana created
service/kibana created  
ingress/kibana created

<span class="token comment">## 配置域名解析 kibana.nohi.com，并访问服务进行验证，若可以访问，说明连接es成功</span>
<span class="token comment">## 通过svc访问 </span>
<span class="token namespace">[root@k8s-master efk]</span><span class="token comment"># kubectl -n logging get svc</span>
NAME              <span class="token function">TYPE</span>        CLUSTER-IP      EXTERNAL-IP   PORT<span class="token punctuation">(</span>S<span class="token punctuation">)</span>          AGE
es-svc            ClusterIP   10<span class="token punctuation">.</span>111<span class="token punctuation">.</span>78<span class="token punctuation">.</span>180   &lt;none&gt;        9200/TCP         9d
es-svc-headless   ClusterIP   None            &lt;none&gt;        9300/TCP         9d
kibana            NodePort    10<span class="token punctuation">.</span>109<span class="token punctuation">.</span>20<span class="token punctuation">.</span>218   &lt;none&gt;        5601:31539/TCP   10m
<span class="token comment">## hosts配置 主机ip(非10.109.20.218) kibana.nohi.com</span>
<span class="token comment">## http://kibana.nohi.com:31539/</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="fluentd服务部署" tabindex="-1"><a class="header-anchor" href="#fluentd服务部署" aria-hidden="true">#</a> Fluentd服务部署</h5><h6 id="部署分析-2" tabindex="-1"><a class="header-anchor" href="#部署分析-2" aria-hidden="true">#</a> 部署分析</h6><ol><li>fluentd为日志采集服务，kubernetes集群的每个业务节点都有日志产生，因此需要使用daemonset的模式进行部署</li><li>为进一步控制资源，会为daemonset指定一个选择标签，fluentd=true来做进一步过滤，只有带有此标签的节点才会部署fluentd</li><li>日志采集，需要采集哪些目录下的日志，采集后发送到es端，因此需要配置的内容比较多，我们选择使用configmap的方式把配置文件整个挂载出来</li></ol><h6 id="部署服务" tabindex="-1"><a class="header-anchor" href="#部署服务" aria-hidden="true">#</a> 部署服务</h6><p><code>efk/fluentd-es-config-main.yaml</code></p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">data</span><span class="token punctuation">:</span>
  <span class="token key atrule">fluent.conf</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token punctuation">-</span>
    <span class="token comment"># This is the root config file, which only includes components of the actual configuration</span>
    <span class="token comment">#</span>
    <span class="token comment">#  Do not collect fluentd&#39;s own logs to avoid infinite loops.</span>
    &lt;match fluent.<span class="token important">**&gt;</span>
    @type null
    &lt;/match<span class="token punctuation">&gt;</span>

    @include /etc/fluent/config.d/<span class="token important">*.conf</span>
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ConfigMap
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">addonmanager.kubernetes.io/mode</span><span class="token punctuation">:</span> Reconcile
  <span class="token key atrule">name</span><span class="token punctuation">:</span> fluentd<span class="token punctuation">-</span>es<span class="token punctuation">-</span>config<span class="token punctuation">-</span>main
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> logging

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>配置文件，fluentd-config.yaml，注意点：</p>`,74),Z=n("li",null,[n("p",null,"数据源source的配置，k8s会默认把容器的标准和错误输出日志重定向到宿主机中")],-1),K={href:"https://github.com/fabric8io/fluent-plugin-kubernetes_metadata_filter",target:"_blank",rel:"noopener noreferrer"},z=n("li",null,[n("p",null,[s("20230301 pod 一直报"),n("code",null,"fluent Unknown output plugin 'detect_exceptions"),s("，搜索后发现需要自己制定image,参考：https://github.com/fluent/fluentd-docker-image#how-to-build-your-own-image")])],-1),Q=n("p",null,"20230305",-1),W={href:"https://zhuanlan.zhihu.com/p/428392678",target:"_blank",rel:"noopener noreferrer"},J=n("p",null,[s("经过种咱尝试，最终修改 fluentd 镜像成功："),n("code",null,"quay.io/fluentd_elasticsearch/fluentd:v4.3.3")],-1),X=n("li",null,[n("p",null,"match输出到es端的flush配置")],-1),nn=t(`<p><code>efk/fluentd-configmap.yaml</code></p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">kind</span><span class="token punctuation">:</span> ConfigMap
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> fluentd<span class="token punctuation">-</span>config
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> logging
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">addonmanager.kubernetes.io/mode</span><span class="token punctuation">:</span> Reconcile
<span class="token key atrule">data</span><span class="token punctuation">:</span>
  <span class="token key atrule">containers.input.conf</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token punctuation">-</span>
    &lt;source<span class="token punctuation">&gt;</span>
      @id fluentd<span class="token punctuation">-</span>containers.log
      @type tail
      path /var/log/containers/<span class="token important">*.log</span>
      pos_file /var/log/es<span class="token punctuation">-</span>containers.log.pos
      time_format %Y<span class="token punctuation">-</span>%m<span class="token punctuation">-</span>%dT%H<span class="token punctuation">:</span>%M<span class="token punctuation">:</span>%S.%NZ
      localtime
      tag raw.kubernetes.*
      format json
      read_from_head false
    &lt;/source<span class="token punctuation">&gt;</span>
    <span class="token comment"># Detect exceptions in the log output and forward them as one log entry.</span>
    <span class="token comment"># https://github.com/GoogleCloudPlatform/fluent-plugin-detect-exceptions </span>
    &lt;match raw.kubernetes.<span class="token important">**&gt;</span>
      @id raw.kubernetes
      @type detect_exceptions
      remove_tag_prefix raw
      message log
      stream stream
      multiline_flush_interval 5
      max_bytes 500000
      max_lines 1000
    &lt;/match<span class="token punctuation">&gt;</span>
  <span class="token key atrule">output.conf</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token punctuation">-</span>
    <span class="token comment"># Enriches records with Kubernetes metadata</span>
    &lt;filter kubernetes.<span class="token important">**&gt;</span>
      @type kubernetes_metadata
    &lt;/filter<span class="token punctuation">&gt;</span>
    &lt;match <span class="token important">**&gt;</span>
      @id elasticsearch
      @type elasticsearch
      @log_level info
      include_tag_key true
      hosts elasticsearch<span class="token punctuation">-</span>0.es<span class="token punctuation">-</span>svc<span class="token punctuation">-</span>headless<span class="token punctuation">:</span><span class="token number">9200</span><span class="token punctuation">,</span>elasticsearch<span class="token punctuation">-</span>1.es<span class="token punctuation">-</span>svc<span class="token punctuation">-</span>headless<span class="token punctuation">:</span><span class="token number">9200</span><span class="token punctuation">,</span>elasticsearch<span class="token punctuation">-</span>2.es<span class="token punctuation">-</span>svc<span class="token punctuation">-</span>headless<span class="token punctuation">:</span><span class="token number">9200</span>
      <span class="token comment">#port 9200</span>
      logstash_format true
      <span class="token comment">#index_name kubernetes-%Y.%m.%d</span>
      request_timeout    30s
      &lt;buffer<span class="token punctuation">&gt;</span>
        @type file
        path /var/log/fluentd<span class="token punctuation">-</span>buffers/kubernetes.system.buffer
        flush_mode interval
        retry_type exponential_backoff
        flush_thread_count 2
        flush_interval 5s
        retry_forever
        retry_max_interval 30
        chunk_limit_size 2M
        queue_limit_length 8
        overflow_action block
      &lt;/buffer<span class="token punctuation">&gt;</span>
    &lt;/match<span class="token punctuation">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>daemonset定义文件，fluentd.yaml，注意点：</p><ol><li>需要配置rbac规则，因为需要访问k8s api去根据日志查询元数据</li><li>需要将/var/log/containers/目录挂载到容器中</li><li>需要将fluentd的configmap中的配置文件挂载到容器内</li><li>想要部署fluentd的节点，需要添加fluentd=true的标签</li></ol><p><code>efk/fluentd-rbac.yaml</code></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>apiVersion: v1
kind: ServiceAccount
metadata:
  name: fluentd-es
  namespace: logging
  labels:
    k8s-app: fluentd-es
    kubernetes.io/cluster-service: &quot;true&quot;
    addonmanager.kubernetes.io/mode: Reconcile
---
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: fluentd-es
  labels:
    k8s-app: fluentd-es
    kubernetes.io/cluster-service: &quot;true&quot;
    addonmanager.kubernetes.io/mode: Reconcile
rules:
- apiGroups:
  - &quot;&quot;
  resources:
  - &quot;namespaces&quot;
  - &quot;pods&quot;
  verbs:
  - &quot;get&quot;
  - &quot;watch&quot;
  - &quot;list&quot;
---
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: fluentd-es
  labels:
    k8s-app: fluentd-es
    kubernetes.io/cluster-service: &quot;true&quot;
    addonmanager.kubernetes.io/mode: Reconcile
subjects:
- kind: ServiceAccount
  name: fluentd-es
  namespace: logging
  apiGroup: &quot;&quot;
roleRef:
  kind: ClusterRole
  name: fluentd-es
  apiGroup: &quot;&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>efk/fluentd-DaemonSet.yaml</code></p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> DaemonSet
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">addonmanager.kubernetes.io/mode</span><span class="token punctuation">:</span> Reconcile
    <span class="token key atrule">k8s-app</span><span class="token punctuation">:</span> fluentd<span class="token punctuation">-</span>es
  <span class="token key atrule">name</span><span class="token punctuation">:</span> fluentd<span class="token punctuation">-</span>es
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> logging
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">k8s-app</span><span class="token punctuation">:</span> fluentd<span class="token punctuation">-</span>es
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">labels</span><span class="token punctuation">:</span>
        <span class="token key atrule">k8s-app</span><span class="token punctuation">:</span> fluentd<span class="token punctuation">-</span>es
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">env</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> FLUENTD_ARGS
          <span class="token key atrule">value</span><span class="token punctuation">:</span> <span class="token punctuation">-</span><span class="token punctuation">-</span>no<span class="token punctuation">-</span>supervisor <span class="token punctuation">-</span>q
        <span class="token key atrule">image</span><span class="token punctuation">:</span> quay.io/fluentd_elasticsearch/fluentd<span class="token punctuation">:</span>v4.3.3
        <span class="token key atrule">imagePullPolicy</span><span class="token punctuation">:</span> IfNotPresent
        <span class="token key atrule">name</span><span class="token punctuation">:</span> fluentd<span class="token punctuation">-</span>es
        <span class="token key atrule">resources</span><span class="token punctuation">:</span>
          <span class="token key atrule">limits</span><span class="token punctuation">:</span>
            <span class="token key atrule">memory</span><span class="token punctuation">:</span> 500Mi
          <span class="token key atrule">requests</span><span class="token punctuation">:</span>
            <span class="token key atrule">cpu</span><span class="token punctuation">:</span> 100m
            <span class="token key atrule">memory</span><span class="token punctuation">:</span> 200Mi
        <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /var/log
          <span class="token key atrule">name</span><span class="token punctuation">:</span> varlog
        <span class="token punctuation">-</span> <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /var/lib/docker/containers
          <span class="token key atrule">name</span><span class="token punctuation">:</span> varlibdockercontainers
          <span class="token key atrule">readOnly</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> config<span class="token punctuation">-</span>volume
          <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /etc/fluent/config.d
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> config<span class="token punctuation">-</span>volume<span class="token punctuation">-</span>main
          <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /etc/fluent/fluent.conf
          <span class="token key atrule">subPath</span><span class="token punctuation">:</span> fluent.conf
      <span class="token key atrule">nodeSelector</span><span class="token punctuation">:</span>
        <span class="token key atrule">fluentd</span><span class="token punctuation">:</span> <span class="token string">&quot;true&quot;</span>
      <span class="token key atrule">securityContext</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
      <span class="token key atrule">serviceAccount</span><span class="token punctuation">:</span> fluentd<span class="token punctuation">-</span>es
      <span class="token key atrule">serviceAccountName</span><span class="token punctuation">:</span> fluentd<span class="token punctuation">-</span>es
      <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">hostPath</span><span class="token punctuation">:</span>
          <span class="token key atrule">path</span><span class="token punctuation">:</span> /var/log
          <span class="token key atrule">type</span><span class="token punctuation">:</span> <span class="token string">&quot;&quot;</span>
        <span class="token key atrule">name</span><span class="token punctuation">:</span> varlog
      <span class="token punctuation">-</span> <span class="token key atrule">hostPath</span><span class="token punctuation">:</span>
          <span class="token key atrule">path</span><span class="token punctuation">:</span> /var/lib/docker/containers
          <span class="token key atrule">type</span><span class="token punctuation">:</span> <span class="token string">&quot;&quot;</span>
        <span class="token key atrule">name</span><span class="token punctuation">:</span> varlibdockercontainers
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> config<span class="token punctuation">-</span>volume
        <span class="token key atrule">configMap</span><span class="token punctuation">:</span>
          <span class="token key atrule">defaultMode</span><span class="token punctuation">:</span> <span class="token number">420</span>
          <span class="token key atrule">name</span><span class="token punctuation">:</span> fluentd<span class="token punctuation">-</span>config
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> config<span class="token punctuation">-</span>volume<span class="token punctuation">-</span>main
        <span class="token key atrule">configMap</span><span class="token punctuation">:</span>
          <span class="token key atrule">name</span><span class="token punctuation">:</span> fluentd<span class="token punctuation">-</span>es<span class="token punctuation">-</span>config<span class="token punctuation">-</span>main
          <span class="token key atrule">defaultMode</span><span class="token punctuation">:</span> <span class="token number">420</span>
          <span class="token key atrule">items</span><span class="token punctuation">:</span>
          <span class="token punctuation">-</span> <span class="token key atrule">key</span><span class="token punctuation">:</span> fluent.conf
            <span class="token key atrule">path</span><span class="token punctuation">:</span> fluent.conf
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token comment">## 给slave1打上标签，进行部署fluentd日志采集服务</span>
$ kubectl label node k8s-worker1 fluentd=true  
$ kubectl label node k8s-worker2 fluentd=true

<span class="token comment"># 创建服务</span>
$ kubectl create <span class="token operator">-</span>f fluentd-es-config-main<span class="token punctuation">.</span>yaml  
configmap/fluentd-es-config-main created  
$ kubectl create <span class="token operator">-</span>f fluentd-configmap<span class="token punctuation">.</span>yaml  
configmap/fluentd-config created  
$ kubectl create <span class="token operator">-</span>f fluentd<span class="token punctuation">.</span>yaml  
serviceaccount/fluentd-es created  
clusterrole<span class="token punctuation">.</span>rbac<span class="token punctuation">.</span>authorization<span class="token punctuation">.</span>k8s<span class="token punctuation">.</span>io/fluentd-es created  
clusterrolebinding<span class="token punctuation">.</span>rbac<span class="token punctuation">.</span>authorization<span class="token punctuation">.</span>k8s<span class="token punctuation">.</span>io/fluentd-es created  
daemonset<span class="token punctuation">.</span>extensions/fluentd-es created 

<span class="token comment">## 然后查看一下pod是否已经在k8s-worker1</span>
$ kubectl <span class="token operator">-</span>n logging get po <span class="token operator">-</span>o wide
NAME                      READY   STATUS    RESTARTS   AGE  
elasticsearch-logging-0   1/1     Running   0          123m  
fluentd-es-246pl   		  1/1     Running   0          2m2s  
kibana-944c57766-ftlcw    1/1     Running   0          50m
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述是简化版的k8s日志部署收集的配置，完全版的可以提供 https://github.com/kubernetes/kubernetes/tree/master/cluster/addons/fluentd-elasticsearch 来查看。</p><h5 id="efk功能验证" tabindex="-1"><a class="header-anchor" href="#efk功能验证" aria-hidden="true">#</a> EFK功能验证</h5><h6 id="验证思路" tabindex="-1"><a class="header-anchor" href="#验证思路" aria-hidden="true">#</a> 验证思路</h6><p>在slave节点中启动服务，同时往标准输出中打印测试日志，到kibana中查看是否可以收集</p><h6 id="创建测试容器" tabindex="-1"><a class="header-anchor" href="#创建测试容器" aria-hidden="true">#</a> 创建测试容器</h6><p><code>efk/test-pod.yaml</code></p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Pod
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> counter
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">nodeSelector</span><span class="token punctuation">:</span>
    <span class="token key atrule">fluentd</span><span class="token punctuation">:</span> <span class="token string">&quot;true&quot;</span>
  <span class="token key atrule">containers</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> count
    <span class="token key atrule">image</span><span class="token punctuation">:</span> alpine<span class="token punctuation">:</span><span class="token number">3.6</span>
    <span class="token key atrule">args</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>/bin/sh<span class="token punctuation">,</span> <span class="token punctuation">-</span>c<span class="token punctuation">,</span>
            <span class="token string">&#39;i=0; while true; do echo &quot;$i: $(date)&quot;; i=$((i+1)); sleep 1; done&#39;</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ kubectl get po  
NAME                          READY   STATUS    RESTARTS   AGE  
counter                       1/1     Running   0          6s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="配置kibana" tabindex="-1"><a class="header-anchor" href="#配置kibana" aria-hidden="true">#</a> 配置kibana</h6><p>登录kibana界面，按照截图的顺序操作：</p><p>💁本次kibana安装版本为8.6.2 和视频中已经相关较大</p><p><code>http://kibana.nohi.com:31539/</code></p><p><img src="`+w+'" alt="image-20230305223231185"></p><p>也可以通过其他元数据来过滤日志数据，比如可以单击任何日志条目以查看其他元数据，如容器名称，Kubernetes 节点，命名空间等，比如kubernetes.pod_name : counter</p><p>到这里，我们就在 Kubernetes 集群上成功部署了 EFK ，要了解如何使用 Kibana 进行日志数据分析，可以参考 Kibana 用户指南文档：https://www.elastic.co/guide/en/kibana/current/index.html</p><h4 id="prometheus实现k8s集群的服务监控" tabindex="-1"><a class="header-anchor" href="#prometheus实现k8s集群的服务监控" aria-hidden="true">#</a> Prometheus实现k8s集群的服务监控</h4><p>Prometheus 是一个开源监控系统，它本身已经成为了云原生中指标监控的事实标准 。</p><h5 id="k8s集群监控体系演变史" tabindex="-1"><a class="header-anchor" href="#k8s集群监控体系演变史" aria-hidden="true">#</a> k8s集群监控体系演变史</h5><p>第一版本：<strong>Cadvisor+InfluxDB+Grafana</strong></p><p>只能从主机维度进行采集，没有Namespace、Pod等维度的汇聚功能</p><p>第二版本： <strong>Heapster+InfluxDB+Grafana</strong></p><p>heapster负责调用各node中的cadvisor接口，对数据进行汇总，然后导到InfluxDB ， 可以从cluster，node，pod的各个层面提供详细的资源使用情况。</p><p><img src="'+x+'" alt=""></p><p>第三版本：Metrics-Server + Prometheus</p><p><img src="'+P+'" alt=""></p><p>k8s对监控接口进行了标准化，主要分了三类：</p><ul><li><p>Resource Metrics</p><p>对应的接口是 metrics.k8s.io，主要的实现就是 metrics-server，它提供的是资源的监控，比较常见的是节点级别、pod 级别、namespace 级别、class 级别。这类的监控指标都可以通过 metrics.k8s.io 这个接口获取到</p></li><li><p>Custom Metrics</p><p>对应的接口是 custom.metrics.k8s.io，主要的实现是 Prometheus， 它提供的是资源监控和自定义监控，资源监控和上面的资源监控其实是有覆盖关系的。</p><p>自定义监控指的是：比如应用上面想暴露一个类似像在线人数，或者说调用后面的这个数据库的 MySQL 的慢查询。这些其实都是可以在应用层做自己的定义的，然后并通过标准的 Prometheus 的 client，暴露出相应的 metrics，然后再被 Prometheus 进行采集</p></li><li><p>External Metrics</p><p>对应的接口是 external.metrics.k8s.io。主要的实现厂商就是各个云厂商的 provider，通过这个 provider 可以通过云资源的监控指标</p></li></ul><h5 id="prometheus架构" tabindex="-1"><a class="header-anchor" href="#prometheus架构" aria-hidden="true">#</a> Prometheus架构</h5><p><img src="'+$+`" alt=""></p><ul><li>Prometheus Server ，监控、告警平台核心，抓取目标端监控数据，生成聚合数据，存储时间序列数据</li><li>exporter，由被监控的对象提供，提供API暴漏监控对象的指标，供prometheus 抓取 <ul><li>node-exporter</li><li>blackbox-exporter</li><li>redis-exporter</li><li>mysql-exporter</li><li>custom-exporter</li><li>...</li></ul></li><li>pushgateway，提供一个网关地址，外部数据可以推送到该网关，prometheus也会从该网关拉取数据</li><li>Alertmanager，接收Prometheus发送的告警并对于告警进行一系列的处理后发送给指定的目标</li><li>Grafana：配置数据源，图标方式展示数据</li></ul><h5 id="prometheus安装" tabindex="-1"><a class="header-anchor" href="#prometheus安装" aria-hidden="true">#</a> Prometheus安装</h5><p>基于go开发， https://github.com/prometheus/prometheus</p><p>若使用docker部署直接启动镜像即可：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ docker run <span class="token operator">--</span>name prometheus <span class="token operator">-</span>d <span class="token operator">-</span>p 127<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>1:9090:9090 prom/prometheus
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>我们想制作Prometheus的yaml文件，可以先启动容器进去看一下默认的启动命令：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ docker run <span class="token operator">-</span>d <span class="token operator">--</span>name tmp <span class="token operator">-</span>p 127<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>1:9090:9090 prom/prometheus:v2<span class="token punctuation">.</span>19<span class="token punctuation">.</span>2
$ docker exec <span class="token operator">-</span>ti tmp sh
<span class="token comment">#/ ps aux</span>
<span class="token comment">#/ cat /etc/prometheus/prometheus.yml</span>
global:
  scrape_interval:     15s <span class="token comment"># Set the scrape interval to every 15 seconds. Default is every 1 minute.</span>
  evaluation_interval: 15s <span class="token comment"># Evaluate rules every 15 seconds. The default is every 1 minute.</span>
  <span class="token comment"># scrape_timeout is set to the global default (10s).</span>

<span class="token comment"># Alertmanager configuration</span>
alerting:
  alertmanagers:
  <span class="token operator">-</span> static_configs:
    <span class="token operator">-</span> targets:
      <span class="token comment"># - alertmanager:9093</span>

<span class="token comment"># Load rules once and periodically evaluate them according to the global &#39;evaluation_interval&#39;.</span>
rule_files:
  <span class="token comment"># - &quot;first_rules.yml&quot;</span>
  <span class="token comment"># - &quot;second_rules.yml&quot;</span>

<span class="token comment"># A scrape configuration containing exactly one endpoint to scrape:</span>
<span class="token comment"># Here it&#39;s Prometheus itself. exporter</span>
scrape_configs:
  <span class="token comment"># The job name is added as a label \`job=&lt;job_name&gt;\` to any timeseries scraped from this config.</span>
  <span class="token operator">-</span> job_name: <span class="token string">&#39;prometheus&#39;</span>

    <span class="token comment"># metrics_path defaults to &#39;/metrics&#39;</span>
    <span class="token comment"># scheme defaults to &#39;http&#39;.</span>

    static_configs:
    <span class="token operator">-</span> targets: <span class="token punctuation">[</span><span class="token string">&#39;localhost:9090&#39;</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>本例中，使用k8s来部署，所需的资源清单如下：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token comment"># 创建新的命名空间 monitor，存储prometheus相关资源</span>
$ <span class="token function">cat</span> prometheus-namespace<span class="token punctuation">.</span>yaml
apiVersion: v1
kind: Namespace
metadata:
  name: monitor

<span class="token comment"># 需要准备配置文件，因此使用configmap的形式保存</span>
$ <span class="token function">cat</span> prometheus-configmap<span class="token punctuation">.</span>yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: monitor
<span class="token keyword">data</span>:
  prometheus<span class="token punctuation">.</span>yml: <span class="token punctuation">|</span>
    global:
      scrape_interval: 15s
      evaluation_interval: 15s
    scrape_configs:
    <span class="token operator">-</span> job_name: <span class="token string">&#39;prometheus&#39;</span>
      static_configs:
      <span class="token operator">-</span> targets: <span class="token punctuation">[</span><span class="token string">&#39;localhost:9090&#39;</span><span class="token punctuation">]</span>


<span class="token comment"># prometheus的资源文件</span>
<span class="token comment"># 出现Prometheus数据存储权限问题，因为Prometheus内部使用nobody启动进程，挂载数据目录后权限为root，因此使用initContainer进行目录权限修复：</span>
$ <span class="token function">cat</span> prometheus-deployment<span class="token punctuation">.</span>yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus
  namespace: monitor
  labels:
    app: prometheus
spec:
  selector:
    matchLabels:
      app: prometheus
  template:
    metadata:
      labels:
        app: prometheus
    spec:
      serviceAccountName: prometheus
      nodeSelector:
        app: prometheus
      initContainers:
      <span class="token operator">-</span> name: <span class="token string">&quot;change-permission-of-directory&quot;</span>
        image: busybox
        command: <span class="token punctuation">[</span><span class="token string">&quot;/bin/sh&quot;</span><span class="token punctuation">]</span>
        args: <span class="token punctuation">[</span><span class="token string">&quot;-c&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;chown -R 65534:65534 /prometheus&quot;</span><span class="token punctuation">]</span>
        securityContext:
          privileged: true
        volumeMounts:
        <span class="token operator">-</span> mountPath: <span class="token string">&quot;/etc/prometheus&quot;</span>
          name: config-volume
        <span class="token operator">-</span> mountPath: <span class="token string">&quot;/prometheus&quot;</span>
          name: <span class="token keyword">data</span>
      containers:
      <span class="token operator">-</span> image: prom/prometheus:v2<span class="token punctuation">.</span>19<span class="token punctuation">.</span>2
        name: prometheus
        args:
        <span class="token operator">-</span> <span class="token string">&quot;--config.file=/etc/prometheus/prometheus.yml&quot;</span>
        <span class="token operator">-</span> <span class="token string">&quot;--storage.tsdb.path=/prometheus&quot;</span>  <span class="token comment"># 指定tsdb数据路径</span>
        <span class="token operator">-</span> <span class="token string">&quot;--web.enable-lifecycle&quot;</span>  <span class="token comment"># 支持热更新，直接执行localhost:9090/-/reload立即生效</span>
        <span class="token operator">-</span> <span class="token string">&quot;--web.console.libraries=/usr/share/prometheus/console_libraries&quot;</span>
        <span class="token operator">-</span> <span class="token string">&quot;--web.console.templates=/usr/share/prometheus/consoles&quot;</span>
        ports:
        <span class="token operator">-</span> containerPort: 9090
          name: http
        volumeMounts:
        <span class="token operator">-</span> mountPath: <span class="token string">&quot;/etc/prometheus&quot;</span>
          name: config-volume
        <span class="token operator">-</span> mountPath: <span class="token string">&quot;/prometheus&quot;</span>
          name: <span class="token keyword">data</span>
        resources:
          requests:
            cpu: 100m
            memory: 512Mi
          limits:
            cpu: 100m
            memory: 512Mi
      volumes:
      <span class="token operator">-</span> name: <span class="token keyword">data</span>
        hostPath:
          path: <span class="token operator">/</span><span class="token keyword">data</span><span class="token operator">/</span>prometheus/
      <span class="token operator">-</span> configMap:
          name: prometheus-config
        name: config-volume
        
<span class="token comment"># rbac,prometheus会调用k8s api做服务发现进行抓取指标</span>
$ <span class="token function">cat</span> prometheus-rbac<span class="token punctuation">.</span>yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: prometheus
  namespace: monitor
<span class="token operator">--</span><span class="token operator">-</span>
apiVersion: rbac<span class="token punctuation">.</span>authorization<span class="token punctuation">.</span>k8s<span class="token punctuation">.</span>io/v1
kind: ClusterRole
metadata:
  name: prometheus
rules:
<span class="token operator">-</span> apiGroups:
  <span class="token operator">-</span> <span class="token string">&quot;&quot;</span>
  resources:
  <span class="token operator">-</span> nodes
  <span class="token operator">-</span> services
  <span class="token operator">-</span> endpoints
  <span class="token operator">-</span> pods
  <span class="token operator">-</span> nodes/proxy
  verbs:
  <span class="token operator">-</span> get
  <span class="token operator">-</span> list
  <span class="token operator">-</span> watch
<span class="token operator">-</span> apiGroups:
  <span class="token operator">-</span> <span class="token string">&quot;extensions&quot;</span>
  resources:
    <span class="token operator">-</span> ingresses
  verbs:
  <span class="token operator">-</span> get
  <span class="token operator">-</span> list
  <span class="token operator">-</span> watch
<span class="token operator">-</span> apiGroups:
  <span class="token operator">-</span> <span class="token string">&quot;&quot;</span>
  resources:
  <span class="token operator">-</span> configmaps
  <span class="token operator">-</span> nodes/metrics
  verbs:
  <span class="token operator">-</span> get
<span class="token operator">-</span> nonResourceURLs:
  <span class="token operator">-</span> <span class="token operator">/</span>metrics
  verbs:
  <span class="token operator">-</span> get
<span class="token operator">--</span><span class="token operator">-</span>
apiVersion: rbac<span class="token punctuation">.</span>authorization<span class="token punctuation">.</span>k8s<span class="token punctuation">.</span>io/v1
kind: ClusterRoleBinding
metadata:
  name: prometheus
roleRef:
  apiGroup: rbac<span class="token punctuation">.</span>authorization<span class="token punctuation">.</span>k8s<span class="token punctuation">.</span>io
  kind: ClusterRole
  name: prometheus
subjects:
<span class="token operator">-</span> kind: ServiceAccount
  name: prometheus
  namespace: monitor


<span class="token comment"># 提供Service，为Ingress使用</span>
$ <span class="token function">cat</span> prometheus-svc<span class="token punctuation">.</span>yaml
apiVersion: v1
kind: Service
metadata:
  name: prometheus
  namespace: monitor
  labels:
    app: prometheus
spec:
  selector:
    app: prometheus
  <span class="token function">type</span>: ClusterIP
  ports:
    <span class="token operator">-</span> name: web
      port: 9090
      targetPort: http

$ <span class="token function">cat</span> prometheus-ingress<span class="token punctuation">.</span>yaml
apiVersion: networking<span class="token punctuation">.</span>k8s<span class="token punctuation">.</span>io/v1
kind: Ingress
metadata:
  name: prometheus
  namespace: monitor
spec:
  rules:
  <span class="token operator">-</span> host: prometheus<span class="token punctuation">.</span>nohi<span class="token punctuation">.</span>com
    http:
      paths:
      <span class="token operator">-</span> path: <span class="token operator">/</span>
        pathType: Prefix
        backend:
          service:
            name: prometheus
            port:
              number: 9090
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>部署上述资源：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token comment"># 命名空间</span>
$ kubectl create <span class="token operator">-</span>f prometheus-namespace<span class="token punctuation">.</span>yaml
  
<span class="token comment"># 给node打上label</span>
$ kubectl label node k8s-worker1 app=prometheus

<span class="token comment">#部署configmap</span>
$ kubectl create <span class="token operator">-</span>f prometheus-configmap<span class="token punctuation">.</span>yaml

<span class="token comment"># rbac</span>
$ kubectl create <span class="token operator">-</span>f prometheus-rbac<span class="token punctuation">.</span>yaml

<span class="token comment"># deployment</span>
$ kubectl create <span class="token operator">-</span>f prometheus-deployment<span class="token punctuation">.</span>yaml

<span class="token comment"># service</span>
$ kubectl create <span class="token operator">-</span>f prometheus-svc<span class="token punctuation">.</span>yaml

<span class="token comment"># ingress</span>
$ kubectl create <span class="token operator">-</span>f prometheus-ingress<span class="token punctuation">.</span>yaml

<span class="token comment"># 访问测试</span>
$ kubectl <span class="token operator">-</span>n monitor get ingress
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="理解时间序列数据库-tsdb" tabindex="-1"><a class="header-anchor" href="#理解时间序列数据库-tsdb" aria-hidden="true">#</a> 理解时间序列数据库（TSDB）</h5><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token comment"># http://localhost:9090/metrics</span>
$ kubectl <span class="token operator">-</span>n monitor get po <span class="token operator">-</span>o wide
prometheus-dcb499cbf-fxttx   1/1     Running   0          13h   10<span class="token punctuation">.</span>244<span class="token punctuation">.</span>1<span class="token punctuation">.</span>132   k8s-worker1 

$ curl http:<span class="token operator">/</span><span class="token operator">/</span>10<span class="token punctuation">.</span>244<span class="token punctuation">.</span>1<span class="token punctuation">.</span>132:9090/metrics
<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
<span class="token comment"># HELP promhttp_metric_handler_requests_total Total number of scrapes by HTTP status code.</span>
<span class="token comment"># TYPE promhttp_metric_handler_requests_total counter</span>
promhttp_metric_handler_requests_total<span class="token punctuation">{</span>code=<span class="token string">&quot;200&quot;</span><span class="token punctuation">}</span> 149
promhttp_metric_handler_requests_total<span class="token punctuation">{</span>code=<span class="token string">&quot;500&quot;</span><span class="token punctuation">}</span> 0
promhttp_metric_handler_requests_total<span class="token punctuation">{</span>code=<span class="token string">&quot;503&quot;</span><span class="token punctuation">}</span> 0

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>tsdb（Time Series Database）</p><p>其中#号开头的两行分别为：</p><ul><li>HELP开头说明该行为指标的帮助信息，通常解释指标的含义</li><li>TYPE开头是指明了指标的类型 <ul><li>counter 计数器</li><li>guage 测量器</li><li>histogram 柱状图</li><li>summary 采样点分位图统计</li></ul></li></ul><p>其中非#开头的每一行表示当前采集到的一个监控样本：</p><ul><li>promhttp_metric_handler_requests_total表明了当前指标的名称</li><li>大括号中的标签则反映了当前样本的一些特征和维度</li><li>浮点数则是该监控样本的具体值。</li></ul><p>每次采集到的数据都会被Prometheus以time-series（时间序列）的方式保存到内存中，定期刷新到硬盘。如下所示，可以将time-series理解为一个以时间为X轴的数字矩阵：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>  ^
  │   <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span>   <span class="token punctuation">.</span> <span class="token punctuation">.</span>   node_cpu<span class="token punctuation">{</span>cpu=<span class="token string">&quot;cpu0&quot;</span><span class="token punctuation">,</span>mode=<span class="token string">&quot;idle&quot;</span><span class="token punctuation">}</span>
  │     <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span>   node_cpu<span class="token punctuation">{</span>cpu=<span class="token string">&quot;cpu0&quot;</span><span class="token punctuation">,</span>mode=<span class="token string">&quot;system&quot;</span><span class="token punctuation">}</span>
  │     <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span>   <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span>   node_load1<span class="token punctuation">{</span><span class="token punctuation">}</span>
  │     <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span>   <span class="token punctuation">.</span> <span class="token punctuation">.</span>  
  v
    &lt;<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span> 时间 <span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span>&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在time-series中的每一个点称为一个样本（sample），样本由以下三部分组成：</p><ul><li>指标(metric)：metric name和描述当前样本特征的labelsets;</li><li>时间戳(timestamp)：一个精确到毫秒的时间戳;</li><li>样本值(value)： 一个float64的浮点型数据表示当前样本的值。</li></ul><p>在形式上，所有的指标(Metric)都通过如下格式标示：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;metric name&gt;{&lt;label name&gt;=&lt;label value&gt;, ...}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>指标的名称(metric name)可以反映被监控样本的含义（比如，<code>http_request_total</code> - 表示当前系统接收到的HTTP请求总量）。</li><li>标签(label)反映了当前样本的特征维度，通过这些维度Prometheus可以对样本数据进行过滤，聚合等。</li></ul><p>Prometheus：定期去Tragets列表拉取监控数据，存储到TSDB中，并且提供指标查询、分析的语句和接口。</p><h5 id="添加监控目标" tabindex="-1"><a class="header-anchor" href="#添加监控目标" aria-hidden="true">#</a> 添加监控目标</h5><p>无论是业务应用还是k8s系统组件，只要提供了metrics api，并且该api返回的数据格式满足标准的Prometheus数据格式要求即可。</p><p>其实，很多组件已经为了适配Prometheus采集指标，添加了对应的/metrics api，比如</p><p>CoreDNS：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ kubectl <span class="token operator">-</span>n kube-system get po <span class="token operator">-</span>owide<span class="token punctuation">|</span>grep coredns
coredns-5bbd96d687-bv9wt  1/1     Running   9 <span class="token punctuation">(</span>7d ago<span class="token punctuation">)</span>        27d     10<span class="token punctuation">.</span>224<span class="token punctuation">.</span>0<span class="token punctuation">.</span>161   k8s-master 
coredns-5bbd96d687-vm595  1/1     Running   10 <span class="token punctuation">(</span>7d ago<span class="token punctuation">)</span>       27d     10<span class="token punctuation">.</span>224<span class="token punctuation">.</span>0<span class="token punctuation">.</span>160   k8s-master
$ curl 10<span class="token punctuation">.</span>224<span class="token punctuation">.</span>0<span class="token punctuation">.</span>161:9153/metrics
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>修改target配置：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ <span class="token function">cat</span> prometheus-configmap<span class="token punctuation">.</span>yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: monitor
<span class="token keyword">data</span>:
  prometheus<span class="token punctuation">.</span>yml: <span class="token punctuation">|</span>
    global:
      scrape_interval: 15s
      scrape_timeout: 15s
    scrape_configs:
    <span class="token operator">-</span> job_name: <span class="token string">&#39;prometheus&#39;</span>
      static_configs:
      <span class="token operator">-</span> targets: <span class="token punctuation">[</span><span class="token string">&#39;localhost:9090&#39;</span><span class="token punctuation">]</span>
    <span class="token operator">-</span> job_name: <span class="token string">&#39;coredns&#39;</span>
      static_configs:
      <span class="token operator">-</span> targets: <span class="token punctuation">[</span><span class="token string">&#39;10.96.0.10:9153&#39;</span><span class="token punctuation">]</span>
      
$ kubectl apply <span class="token operator">-</span>f prometheus-configmap<span class="token punctuation">.</span>yaml

<span class="token comment"># 重建pod生效</span>
$ kubectl <span class="token operator">-</span>n monitor delete po prometheus-dcb499cbf-fxttx
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="常用监控对象的指标采集" tabindex="-1"><a class="header-anchor" href="#常用监控对象的指标采集" aria-hidden="true">#</a> 常用监控对象的指标采集</h5><p>对于集群的监控一般我们需要考虑以下几个方面：</p><ul><li>内部系统组件的状态：比如 kube-apiserver、kube-scheduler、kube-controller-manager、kubedns/coredns 等组件的详细运行状态</li><li>Kubernetes 节点的监控：比如节点的 cpu、load、disk、memory 等指标</li><li>业务容器指标的监控（容器CPU、内存、磁盘等）</li><li>编排级的 metrics：比如 Deployment 的状态、资源请求、调度和 API 延迟等数据指标</li></ul><h6 id="监控kube-apiserver" tabindex="-1"><a class="header-anchor" href="#监控kube-apiserver" aria-hidden="true">#</a> 监控kube-apiserver</h6><p>apiserver自身也提供了/metrics 的api来提供监控数据，</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ kubectl get svc
NAME         <span class="token function">TYPE</span>        CLUSTER-IP   EXTERNAL-IP   PORT<span class="token punctuation">(</span>S<span class="token punctuation">)</span>   AGE
kubernetes   ClusterIP   10<span class="token punctuation">.</span>96<span class="token punctuation">.</span>0<span class="token punctuation">.</span>1    &lt;none&gt;        443/TCP   23d

<span class="token comment"># tokent可通过prometheus获取</span>
<span class="token comment"># </span>
$ curl <span class="token operator">-</span>k  <span class="token operator">-</span>H <span class="token string">&quot;Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6InhXcmtaSG5ZODF1TVJ6dUcycnRLT2c4U3ZncVdoVjlLaVRxNG1wZ0pqVmcifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJhZG1pbi10b2tlbi1xNXBueiIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJhZG1pbiIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6ImViZDg2ODZjLWZkYzAtNDRlZC04NmZlLTY5ZmE0ZTE1YjBmMCIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDprdWJlcm5ldGVzLWRhc2hib2FyZDphZG1pbiJ9.iEIVMWg2mHPD88GQ2i4uc_60K4o17e39tN0VI_Q_s3TrRS8hmpi0pkEaN88igEKZm95Qf1qcN9J5W5eqOmcK2SN83Dd9dyGAGxuNAdEwi0i73weFHHsjDqokl9_4RGbHT5lRY46BbIGADIphcTeVbCggI6T_V9zBbtl8dcmsd-lD_6c6uC2INtPyIfz1FplynkjEVLapp_45aXZ9IMy76ljNSA8Uc061Uys6PD3IXsUD5JJfdm7lAt0F7rn9SdX1q10F2lIHYCMcCcfEpLr4Vkymxb4IU4RCR8BsMOPIO_yfRVeYZkG4gU2C47KwxpLsJRrTUcUXJktSEPdeYYXf9w&quot;</span> https:<span class="token operator">/</span><span class="token operator">/</span>172<span class="token punctuation">.</span>21<span class="token punctuation">.</span>51<span class="token punctuation">.</span>67:6443/metrics
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以通过手动配置如下job来试下对apiserver服务的监控，</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ <span class="token function">cat</span> prometheus-configmap<span class="token punctuation">.</span>yaml
<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
    <span class="token operator">-</span> job_name: <span class="token string">&#39;kubernetes-apiserver&#39;</span>
      static_configs:
      <span class="token operator">-</span> targets: <span class="token punctuation">[</span><span class="token string">&#39;10.96.0.1&#39;</span><span class="token punctuation">]</span>
      scheme: https
      tls_config:
        ca_file: <span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>run/secrets/kubernetes<span class="token punctuation">.</span>io/serviceaccount/ca<span class="token punctuation">.</span>crt
        insecure_skip_verify: true
      bearer_token_file: <span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>run/secrets/kubernetes<span class="token punctuation">.</span>io/serviceaccount/token
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="监控集群节点基础指标" tabindex="-1"><a class="header-anchor" href="#监控集群节点基础指标" aria-hidden="true">#</a> 监控集群节点基础指标</h6><p>node_exporter https://github.com/prometheus/node_exporter</p><p>分析：</p><ul><li>每个节点都需要监控，因此可以使用DaemonSet类型来管理node_exporter</li><li>添加节点的容忍配置</li><li>挂载宿主机中的系统文件信息</li></ul><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: node-exporter
  namespace: monitor
  labels:
    app: node-exporter
spec:
  selector:
    matchLabels:
      app: node-exporter
  template:
    metadata:
      labels:
        app: node-exporter
    spec:
      hostPID: true
      hostIPC: true
      hostNetwork: true
      nodeSelector:
        kubernetes<span class="token punctuation">.</span>io/os: linux
      containers:
      <span class="token operator">-</span> name: node-exporter
        image: prom/node-exporter:v1<span class="token punctuation">.</span>0<span class="token punctuation">.</span>1
        args:
        <span class="token operator">-</span> <span class="token operator">--</span>web<span class="token punctuation">.</span>listen-address=$<span class="token punctuation">(</span>HOSTIP<span class="token punctuation">)</span>:9100
        <span class="token operator">-</span> <span class="token operator">--</span>path<span class="token punctuation">.</span>procfs=<span class="token operator">/</span>host/proc
        <span class="token operator">-</span> <span class="token operator">--</span>path<span class="token punctuation">.</span>sysfs=<span class="token operator">/</span>host/sys
        <span class="token operator">-</span> <span class="token operator">--</span>path<span class="token punctuation">.</span>rootfs=<span class="token operator">/</span>host/root
        <span class="token operator">-</span> <span class="token operator">--</span>collector<span class="token punctuation">.</span>filesystem<span class="token punctuation">.</span>ignored-<span class="token function">mount</span><span class="token operator">-</span>points=^<span class="token operator">/</span><span class="token punctuation">(</span>dev<span class="token punctuation">|</span>proc<span class="token punctuation">|</span>sys<span class="token punctuation">|</span><span class="token keyword">var</span><span class="token operator">/</span>lib/docker/<span class="token punctuation">.</span><span class="token operator">+</span><span class="token punctuation">)</span><span class="token punctuation">(</span>$<span class="token punctuation">|</span><span class="token operator">/</span><span class="token punctuation">)</span>
        <span class="token operator">-</span> <span class="token operator">--</span>collector<span class="token punctuation">.</span>filesystem<span class="token punctuation">.</span>ignored-fs-types=^<span class="token punctuation">(</span>autofs<span class="token punctuation">|</span>binfmt_misc<span class="token punctuation">|</span>cgroup<span class="token punctuation">|</span>configfs<span class="token punctuation">|</span>debugfs<span class="token punctuation">|</span>devpts<span class="token punctuation">|</span>devtmpfs<span class="token punctuation">|</span>fusectl<span class="token punctuation">|</span>hugetlbfs<span class="token punctuation">|</span>mqueue<span class="token punctuation">|</span>overlay<span class="token punctuation">|</span>proc<span class="token punctuation">|</span>procfs<span class="token punctuation">|</span>pstore<span class="token punctuation">|</span>rpc_pipefs<span class="token punctuation">|</span>securityfs<span class="token punctuation">|</span>sysfs<span class="token punctuation">|</span>tracefs<span class="token punctuation">)</span>$
        ports:
        <span class="token operator">-</span> containerPort: 9100
        env:
        <span class="token operator">-</span> name: HOSTIP
          valueFrom:
            fieldRef:
              fieldPath: status<span class="token punctuation">.</span>hostIP
        resources:
          requests:
            cpu: 150m
            memory: 180Mi
          limits:
            cpu: 150m
            memory: 180Mi
        securityContext:
          runAsNonRoot: true
          runAsUser: 65534
        volumeMounts:
        <span class="token operator">-</span> name: proc
          mountPath: <span class="token operator">/</span>host/proc
        <span class="token operator">-</span> name: sys
          mountPath: <span class="token operator">/</span>host/sys
        <span class="token operator">-</span> name: root
          mountPath: <span class="token operator">/</span>host/root
          mountPropagation: HostToContainer
          readOnly: true
      tolerations:
      <span class="token operator">-</span> operator: <span class="token string">&quot;Exists&quot;</span>
      volumes:
      <span class="token operator">-</span> name: proc
        hostPath:
          path: <span class="token operator">/</span>proc
      <span class="token operator">-</span> name: dev
        hostPath:
          path: <span class="token operator">/</span>dev
      <span class="token operator">-</span> name: sys
        hostPath:
          path: <span class="token operator">/</span>sys
      <span class="token operator">-</span> name: root
        hostPath:
          path: <span class="token operator">/</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>创建node-exporter服务</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ kubectl create <span class="token operator">-</span>f node-exporter<span class="token punctuation">.</span>yaml

$ kubectl <span class="token operator">-</span>n monitor get po
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>问题来了，如何添加到Prometheus的target中？</p><ul><li>配置一个Service，后端挂载node-exporter的服务，把Service的地址配置到target中 <ul><li>带来新的问题，target中无法直观的看到各节点node-exporter的状态</li></ul></li><li>把每个node-exporter的服务都添加到target列表中 <ul><li>带来新的问题，集群节点的增删，都需要手动维护列表</li><li>target列表维护量随着集群规模增加</li></ul></li></ul><h6 id="prometheus的服务发现与relabeling" tabindex="-1"><a class="header-anchor" href="#prometheus的服务发现与relabeling" aria-hidden="true">#</a> Prometheus的服务发现与Relabeling</h6><p>之前已经给Prometheus配置了RBAC，有读取node的权限，因此Prometheus可以去调用Kubernetes API获取node信息，所以Prometheus通过与 Kubernetes API 集成，提供了内置的服务发现分别是：<code>Node</code>、<code>Service</code>、<code>Pod</code>、<code>Endpoints</code>、<code>Ingress</code></p><p>配置job即可：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>    <span class="token operator">-</span> job_name: <span class="token string">&#39;kubernetes-sd-node-exporter&#39;</span>
      kubernetes_sd_configs:
        <span class="token operator">-</span> role: node
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>重建查看效果：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ kubectl apply <span class="token operator">-</span>f prometheus-configmap<span class="token punctuation">.</span>yaml
$ kubectl <span class="token operator">-</span>n monitor delete po prometheus-dcb499cbf-6cwlg
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="`+S+'" alt=""></p><p>默认访问的地址是http://node-ip/10250/metrics，10250是kubelet API的服务端口，说明Prometheus的node类型的服务发现模式，默认是和kubelet的10250绑定的，而我们是期望使用node-exporter作为采集的指标来源，因此需要把访问的endpoint替换成http://node-ip:9100/metrics。</p><p><img src="'+i+`" alt=""></p><p>在真正抓取数据前，Prometheus提供了relabeling的能力。怎么理解？</p><p>查看Target的Label列，可以发现，每个target对应会有很多Before Relabeling的标签，这些__开头的label是系统内部使用，不会存储到样本的数据里，但是，我们在查看数据的时候，可以发现，每个数据都有两个默认的label，即：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>prometheus_notifications_dropped_total<span class="token punctuation">{</span>instance=<span class="token string">&quot;localhost:9090&quot;</span><span class="token punctuation">,</span>job=<span class="token string">&quot;prometheus&quot;</span><span class="token punctuation">}</span>	

\`instance\`的值其实则取自于\`__address__\`
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这种发生在采集样本数据之前，对Target实例的标签进行重写的机制在Prometheus被称为Relabeling。</p><p>因此，利用relabeling的能力，只需要将<code>__address__</code>替换成node_exporter的服务地址即可。</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>    <span class="token operator">-</span> job_name: <span class="token string">&#39;kubernetes-sd-node-exporter&#39;</span>
      kubernetes_sd_configs:
        <span class="token operator">-</span> role: node
      relabel_configs:
      <span class="token operator">-</span> source_labels: <span class="token punctuation">[</span>__address__<span class="token punctuation">]</span>
        regex: <span class="token string">&#39;(.*):10250&#39;</span>
        replacement: <span class="token string">&#39;\${1}:9100&#39;</span>
        target_label: __address__
        action: replace
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>再次更新Prometheus服务后，查看targets列表及node-exporter提供的指标，node_load1</p><h6 id="使用cadvisor实现容器监控指标的采集-废弃" tabindex="-1"><a class="header-anchor" href="#使用cadvisor实现容器监控指标的采集-废弃" aria-hidden="true">#</a> 使用cadvisor实现容器监控指标的采集（废弃）</h6><p><code>cAdvisor</code> 指标访问路径为 <code>https://10.96.0.1/api/v1/nodes/&lt;node_name&gt;/proxy/metrics/cadvisor</code></p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>https:<span class="token operator">/</span><span class="token operator">/</span>10<span class="token punctuation">.</span>96<span class="token punctuation">.</span>0<span class="token punctuation">.</span>1/api/v1/nodes/k8s-master/proxy/metrics/cadvisor
https:<span class="token operator">/</span><span class="token operator">/</span>10<span class="token punctuation">.</span>96<span class="token punctuation">.</span>0<span class="token punctuation">.</span>1/api/v1/nodes/k8s-worker1/proxy/metrics/cadvisor
https:<span class="token operator">/</span><span class="token operator">/</span>10<span class="token punctuation">.</span>96<span class="token punctuation">.</span>0<span class="token punctuation">.</span>1/api/v1/nodes/k8s-worker2/proxy/metrics/cadvisor
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>分析：</p><ul><li>每个节点都需要做替换，可以利用Prometheus服务发现中 <code>node</code>这种role</li></ul><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>    <span class="token operator">-</span> job_name: <span class="token string">&#39;kubernetes-sd-cadvisor&#39;</span>
      kubernetes_sd_configs:
        <span class="token operator">-</span> role: node
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>默认添加的target列表为：<code>__schema__://__address__ __metrics_path__</code></p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>http:<span class="token operator">/</span><span class="token operator">/</span>172<span class="token punctuation">.</span>21<span class="token punctuation">.</span>51<span class="token punctuation">.</span>67:10250/metrics
http:<span class="token operator">/</span><span class="token operator">/</span>172<span class="token punctuation">.</span>21<span class="token punctuation">.</span>51<span class="token punctuation">.</span>68:10250/metrics
http:<span class="token operator">/</span><span class="token operator">/</span>172<span class="token punctuation">.</span>21<span class="token punctuation">.</span>51<span class="token punctuation">.</span>69:10250/metrics
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><p>抓取的地址是相同的，可以用<code>10.96.0.1</code>做固定值进行替换<code>__address__</code></p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>    <span class="token operator">-</span> job_name: <span class="token string">&#39;kubernetes-sd-cadvisor&#39;</span>
      kubernetes_sd_configs:
        <span class="token operator">-</span> role: node
      relabel_configs:
      <span class="token operator">-</span> target_label: __address__
        replacement: 10<span class="token punctuation">.</span>96<span class="token punctuation">.</span>0<span class="token punctuation">.</span>1
        action: replace
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>目前为止，替换后的样子：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>http:<span class="token operator">/</span><span class="token operator">/</span>10<span class="token punctuation">.</span>96<span class="token punctuation">.</span>0<span class="token punctuation">.</span>1/metrics
http:<span class="token operator">/</span><span class="token operator">/</span>10<span class="token punctuation">.</span>96<span class="token punctuation">.</span>0<span class="token punctuation">.</span>1/metrics
http:<span class="token operator">/</span><span class="token operator">/</span>10<span class="token punctuation">.</span>96<span class="token punctuation">.</span>0<span class="token punctuation">.</span>1/metrics
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>需要把找到node-name，来做动态替换<code>__metrics_path__</code></p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>    <span class="token operator">-</span> job_name: <span class="token string">&#39;kubernetes-sd-cadvisor&#39;</span>
      kubernetes_sd_configs:
        <span class="token operator">-</span> role: node
      relabel_configs:
      <span class="token operator">-</span> target_label: __address__
        replacement: 10<span class="token punctuation">.</span>96<span class="token punctuation">.</span>0<span class="token punctuation">.</span>1
        action: replace
      <span class="token operator">-</span> source_labels: <span class="token punctuation">[</span>__meta_kubernetes_node_name<span class="token punctuation">]</span>
        regex: <span class="token punctuation">(</span><span class="token punctuation">.</span><span class="token operator">+</span><span class="token punctuation">)</span>
        target_label: __metrics_path__
        replacement: <span class="token operator">/</span>api/v1/nodes/$<span class="token punctuation">{</span>1<span class="token punctuation">}</span><span class="token operator">/</span>proxy/metrics/cadvisor
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>目前为止，替换后的样子：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>http:<span class="token operator">/</span><span class="token operator">/</span>10<span class="token punctuation">.</span>96<span class="token punctuation">.</span>0<span class="token punctuation">.</span>1/api/v1/nodes/k8s-master/proxy/metrics/cadvisor
http:<span class="token operator">/</span><span class="token operator">/</span>10<span class="token punctuation">.</span>96<span class="token punctuation">.</span>0<span class="token punctuation">.</span>1/api/v1/nodes/k8s-worker1/proxy/metrics/cadvisor
http:<span class="token operator">/</span><span class="token operator">/</span>10<span class="token punctuation">.</span>96<span class="token punctuation">.</span>0<span class="token punctuation">.</span>1/api/v1/nodes/k8s-worker2/proxy/metrics/cadvisor
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>加上api-server的认证信息</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>    <span class="token operator">-</span> job_name: <span class="token string">&#39;kubernetes-sd-cadvisor&#39;</span>
      kubernetes_sd_configs:
        <span class="token operator">-</span> role: node
      scheme: https
      tls_config:
        ca_file: <span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>run/secrets/kubernetes<span class="token punctuation">.</span>io/serviceaccount/ca<span class="token punctuation">.</span>crt
        insecure_skip_verify: true
      bearer_token_file: <span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>run/secrets/kubernetes<span class="token punctuation">.</span>io/serviceaccount/token
      relabel_configs:
      <span class="token operator">-</span> target_label: __address__
        replacement: 10<span class="token punctuation">.</span>96<span class="token punctuation">.</span>0<span class="token punctuation">.</span>1
      <span class="token operator">-</span> source_labels: <span class="token punctuation">[</span>__meta_kubernetes_node_name<span class="token punctuation">]</span>
        regex: <span class="token punctuation">(</span><span class="token punctuation">.</span><span class="token operator">+</span><span class="token punctuation">)</span>
        target_label: __metrics_path__
        replacement: <span class="token operator">/</span>api/v1/nodes/$<span class="token punctuation">{</span>1<span class="token punctuation">}</span><span class="token operator">/</span>proxy/metrics/cadvisor
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><p>重新应用配置，然后重建Prometheus的pod。查看targets列表，查看cadvisor指标，比如container_cpu_system_seconds_total，container_memory_usage_bytes</p><p>综上，利用node类型，可以实现对daemonset类型服务的目标自动发现以及监控数据抓取。</p><h6 id="使用cadvisor实现容器指标的采集-新" tabindex="-1"><a class="header-anchor" href="#使用cadvisor实现容器指标的采集-新" aria-hidden="true">#</a> 使用cadvisor实现容器指标的采集（新）</h6><p>目前cAdvisor集成到了kubelet组件内 ，因此可以通过kubelet的接口实现容器指标的采集，具体的API为:</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>https:<span class="token operator">/</span><span class="token operator">/</span>&lt;node-ip&gt;:10250/metrics/cadvisor    <span class="token comment"># node上的cadvisor采集到的容器指标</span>
https:<span class="token operator">/</span><span class="token operator">/</span>&lt;node-ip&gt;:10250/metrics             <span class="token comment"># node上的kubelet的指标数据</span>

<span class="token comment"># 可以通过curl -k  -H &quot;Authorization: Bearer xxxx&quot; https://xxxx/xx查看</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>因此，针对容器指标来讲，我们期望的采集target是：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>https:<span class="token operator">/</span><span class="token operator">/</span>172<span class="token punctuation">.</span>21<span class="token punctuation">.</span>51<span class="token punctuation">.</span>67:10250/metrics/cadvisor
https:<span class="token operator">/</span><span class="token operator">/</span>172<span class="token punctuation">.</span>21<span class="token punctuation">.</span>51<span class="token punctuation">.</span>68:10250/metrics/cadvisor
https:<span class="token operator">/</span><span class="token operator">/</span>172<span class="token punctuation">.</span>21<span class="token punctuation">.</span>51<span class="token punctuation">.</span>69:10250/metrics/cadvisor
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>即每个node节点都需要去采集数据，联想到prometheus的服务发现中的node类型，因此，配置：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code>    <span class="token punctuation">-</span> <span class="token key atrule">job_name</span><span class="token punctuation">:</span> <span class="token string">&#39;kubernetes-sd-cadvisor&#39;</span>
      <span class="token key atrule">kubernetes_sd_configs</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">role</span><span class="token punctuation">:</span> node
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>默认添加的target列表为：<code>__schema__://__address__ __metrics_path__</code></p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>http:<span class="token operator">/</span><span class="token operator">/</span>172<span class="token punctuation">.</span>21<span class="token punctuation">.</span>51<span class="token punctuation">.</span>67:10250/metrics
http:<span class="token operator">/</span><span class="token operator">/</span>172<span class="token punctuation">.</span>21<span class="token punctuation">.</span>51<span class="token punctuation">.</span>68:10250/metrics
http:<span class="token operator">/</span><span class="token operator">/</span>172<span class="token punctuation">.</span>21<span class="token punctuation">.</span>51<span class="token punctuation">.</span>69:10250/metrics
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>和期望值不同的是<code>__schema__</code>和<code>__metrics_path__</code>，针对<code>__metrics_path__</code>可以使用relabel修改：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code>      <span class="token key atrule">relabel_configs</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">target_label</span><span class="token punctuation">:</span> __metrics_path__
        <span class="token key atrule">replacement</span><span class="token punctuation">:</span> /metrics/cadvisor
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>针对<code>__schema__</code>：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code>    <span class="token punctuation">-</span> <span class="token key atrule">job_name</span><span class="token punctuation">:</span> <span class="token string">&#39;kubernetes-sd-cadvisor&#39;</span>
      <span class="token key atrule">kubernetes_sd_configs</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">role</span><span class="token punctuation">:</span> node
      <span class="token key atrule">scheme</span><span class="token punctuation">:</span> https
      <span class="token key atrule">tls_config</span><span class="token punctuation">:</span>
        <span class="token key atrule">ca_file</span><span class="token punctuation">:</span> /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
        <span class="token key atrule">insecure_skip_verify</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
      <span class="token key atrule">bearer_token_file</span><span class="token punctuation">:</span> /var/run/secrets/kubernetes.io/serviceaccount/token
      <span class="token key atrule">relabel_configs</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">target_label</span><span class="token punctuation">:</span> __metrics_path__
        <span class="token key atrule">replacement</span><span class="token punctuation">:</span> /metrics/cadvisor
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>重新应用配置，然后重建Prometheus的pod。查看targets列表，查看cadvisor指标，比如container_cpu_system_seconds_total，container_memory_usage_bytes</p><p>综上，利用node类型，可以实现对daemonset类型服务的目标自动发现以及监控数据抓取。</p><p>补充：</p><p>若想采集kubelet的指标：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code>    <span class="token punctuation">-</span> <span class="token key atrule">job_name</span><span class="token punctuation">:</span> <span class="token string">&#39;kubernetes-sd-kubelet&#39;</span>
      <span class="token key atrule">kubernetes_sd_configs</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">role</span><span class="token punctuation">:</span> node
      <span class="token key atrule">scheme</span><span class="token punctuation">:</span> https
      <span class="token key atrule">tls_config</span><span class="token punctuation">:</span>
        <span class="token key atrule">ca_file</span><span class="token punctuation">:</span> /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
        <span class="token key atrule">insecure_skip_verify</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
      <span class="token key atrule">bearer_token_file</span><span class="token punctuation">:</span> /var/run/secrets/kubernetes.io/serviceaccount/token
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="集群service服务的监控指标采集" tabindex="-1"><a class="header-anchor" href="#集群service服务的监控指标采集" aria-hidden="true">#</a> 集群Service服务的监控指标采集</h6><p>比如集群中存在100个业务应用，每个业务应用都需要被Prometheus监控。</p><p>每个服务是不是都需要手动添加配置？有没有更好的方式？</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>    <span class="token operator">-</span> job_name: <span class="token string">&#39;kubernetes-sd-endpoints&#39;</span>
      kubernetes_sd_configs:
        <span class="token operator">-</span> role: endpoints
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>添加到Prometheus配置中进行测试：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ kubectl apply <span class="token operator">-</span>f prometheus-configmap<span class="token punctuation">.</span>yaml
$ kubectl <span class="token operator">-</span>n monitor delete po prometheus-dcb499cbf-4h9qj

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此使的Target列表中，<code>kubernetes-sd-endpoints</code>下出现了N多条数据，</p><p><img src="`+M+`" alt=""></p><p>可以发现，实际上endpoint这个类型，目标是去抓取整个集群中所有的命名空间的Endpoint列表，然后使用默认的/metrics进行数据抓取，我们可以通过查看集群中的所有ep列表来做对比：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ kubectl get endpoints <span class="token operator">--</span>all-namespaces
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>但是实际上并不是每个服务都已经实现了/metrics监控的，也不是每个实现了/metrics接口的服务都需要注册到Prometheus中，因此，我们需要一种方式对需要采集的服务实现自主可控。这就需要利用relabeling中的keep功能。</p><p><img src="`+i+`" alt=""></p><p>我们知道，relabel的作用对象是target的Before Relabling标签，比如说，假如通过如下定义:</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token operator">-</span> job_name: <span class="token string">&#39;kubernetes-sd-endpoints&#39;</span>
  kubernetes_sd_configs:
  <span class="token operator">-</span> role: endpoints
  relabel_configs:
  <span class="token operator">-</span> source_labels: <span class="token punctuation">[</span>__keep_this_service__<span class="token punctuation">]</span>
    action: keep
    regex: “true”
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>那么就可以实现target的Before Relabling中若存在<code>__keep_this_service__</code>，且值为<code>true</code>的话，则会加入到kubernetes-endpoints这个target中，否则就会被删除。</p><p>因此可以为我们期望被采集的服务，加上对应的Prometheus的label即可。</p><p>问题来了，怎么加？</p><p>查看coredns的metrics类型Before Relabling中的值，可以发现，存在如下类型的Prometheus的标签：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>__meta_kubernetes_service_annotation_prometheus_io_scrape=<span class="token string">&quot;true&quot;</span>
__meta_kubernetes_service_annotation_prometheus_io_port=<span class="token string">&quot;9153&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>这些内容是如何生成的呢，查看coredns对应的服务属性：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ kubectl <span class="token operator">-</span>n kube-system get service kube-dns <span class="token operator">-</span>oyaml
apiVersion: v1
kind: Service
metadata:
  annotations:
    prometheus<span class="token punctuation">.</span>io/port: <span class="token string">&quot;9153&quot;</span>
    prometheus<span class="token punctuation">.</span>io/scrape: <span class="token string">&quot;true&quot;</span>
  creationTimestamp: <span class="token string">&quot;2020-06-28T17:05:35Z&quot;</span>
  labels:
    k8s-app: kube-dns
    kubernetes<span class="token punctuation">.</span>io/cluster-service: <span class="token string">&quot;true&quot;</span>
    kubernetes<span class="token punctuation">.</span>io/name: KubeDNS
  name: kube-dns
  namespace: kube-system
  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>发现存在annotations声明，因此，可以联想到二者存在对应关系，Service的定义中的annotations里的特殊字符会被转换成Prometheus中的label中的下划线。</p><p>我们即可以使用如下配置，来定义服务是否要被抓取监控数据。</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token operator">-</span> job_name: <span class="token string">&#39;kubernetes-sd-endpoints&#39;</span>
  kubernetes_sd_configs:
  <span class="token operator">-</span> role: endpoints
  relabel_configs:
  <span class="token operator">-</span> source_labels: <span class="token punctuation">[</span>__meta_kubernetes_service_annotation_prometheus_io_scrape<span class="token punctuation">]</span>
    action: keep
    regex: true
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样的话，我们只需要为服务定义上如下的声明，即可实现Prometheus自动采集数据</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>  annotations:
	prometheus<span class="token punctuation">.</span>io/scrape: <span class="token string">&quot;true&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>有些时候，我们业务应用提供监控数据的path地址并不一定是/metrics，如何实现兼容？</p><p>同样的思路，我们知道，Prometheus会默认使用Before Relabling中的<code>__metrics_path</code>作为采集路径，因此，我们再自定义一个annotation，<code>prometheus.io/path</code></p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>  annotations:
	prometheus<span class="token punctuation">.</span>io/scrape: <span class="token string">&quot;true&quot;</span>
	prometheus<span class="token punctuation">.</span>io/path: <span class="token string">&quot;/path/to/metrics&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样，Prometheus端会自动生成如下标签：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>__meta_kubernetes_service_annotation_prometheus_io_path=<span class="token string">&quot;/path/to/metrics&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>我们只需要在relabel_configs中用该标签的值，去重写<code>__metrics_path__</code>的值即可。因此：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token operator">-</span> job_name: <span class="token string">&#39;kubernetes-sd-endpoints&#39;</span>
  kubernetes_sd_configs:
  <span class="token operator">-</span> role: endpoints
  relabel_configs:
  <span class="token operator">-</span> source_labels: <span class="token punctuation">[</span>__meta_kubernetes_service_annotation_prometheus_io_scrape<span class="token punctuation">]</span>
    action: keep
    regex: true
  <span class="token operator">-</span> source_labels: <span class="token punctuation">[</span>__meta_kubernetes_service_annotation_prometheus_io_path<span class="token punctuation">]</span>
    action: replace
    target_label: __metrics_path__
    regex: <span class="token punctuation">(</span><span class="token punctuation">.</span><span class="token operator">+</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>有些时候，业务服务的metrics是独立的端口，比如coredns，业务端口是53，监控指标采集端口是9153，这种情况，如何处理？</p><p>很自然的，我们会想到通过自定义annotation来处理，</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>  annotations:
	prometheus<span class="token punctuation">.</span>io/scrape: <span class="token string">&quot;true&quot;</span>
	prometheus<span class="token punctuation">.</span>io/path: <span class="token string">&quot;/path/to/metrics&quot;</span>
	prometheus<span class="token punctuation">.</span>io/port: <span class="token string">&quot;9153&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如何去替换？</p><p>我们知道Prometheus默认使用Before Relabeling中的<code>__address__</code>进行作为服务指标采集的地址，但是该地址的格式通常是这样的</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>__address__=<span class="token string">&quot;10.244.0.20:53&quot;</span>
__address__=<span class="token string">&quot;10.244.0.21&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>我们的目标是将如下两部分拼接在一起：</p><ul><li>10.244.0.20</li><li>prometheus.io/port定义的值，即<code>__meta_kubernetes_service_annotation_prometheus_io_port</code>的值</li></ul><p>因此，需要使用正则规则取出上述两部分：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>  <span class="token operator">-</span> source_labels: <span class="token punctuation">[</span>__address__<span class="token punctuation">,</span> __meta_kubernetes_service_annotation_prometheus_io_port<span class="token punctuation">]</span>
    action: replace
    target_label: __address__
    regex: <span class="token punctuation">(</span><span class="token punctuation">[</span>^:<span class="token punctuation">]</span><span class="token operator">+</span><span class="token punctuation">)</span><span class="token punctuation">(</span>?::\\d+<span class="token punctuation">)</span>?<span class="token punctuation">;</span><span class="token punctuation">(</span>\\d+<span class="token punctuation">)</span>
    replacement: <span class="token variable">$1</span>:<span class="token variable">$2</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>需要注意的几点：</p><ul><li><code>__address__</code>中的<code>:53</code>有可能不存在，因此，使用<code>()?</code>的匹配方式进行</li><li>表达式中，三段<code>()</code>我们只需要第一和第三段，不需要中间括号部分的内容，因此使用<code>?:</code>的方式来做非获取匹配，即可以匹配内容，但是不会被记录到$1,$2这种变量中</li><li>多个source_labels中间默认使用<code>;</code>号分割，因此匹配的时候需要注意添加<code>;</code>号</li></ul><p>此外，还可以将before relabeling 中的更多常用的字段取出来添加到目标的label中，比如：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>  <span class="token operator">-</span> source_labels: <span class="token punctuation">[</span>__meta_kubernetes_namespace<span class="token punctuation">]</span>
    action: replace
    target_label: kubernetes_namespace
  <span class="token operator">-</span> source_labels: <span class="token punctuation">[</span>__meta_kubernetes_service_name<span class="token punctuation">]</span>
    action: replace
    target_label: kubernetes_name
  <span class="token operator">-</span> source_labels: <span class="token punctuation">[</span>__meta_kubernetes_pod_name<span class="token punctuation">]</span>
    action: replace
    target_label: kubernetes_pod_name    
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>因此，目前的relabel的配置如下：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>    <span class="token operator">-</span> job_name: <span class="token string">&#39;kubernetes-sd-endpoints&#39;</span>
      kubernetes_sd_configs:
      <span class="token operator">-</span> role: endpoints
      relabel_configs:
      <span class="token operator">-</span> source_labels: <span class="token punctuation">[</span>__meta_kubernetes_service_annotation_prometheus_io_scrape<span class="token punctuation">]</span>
        action: keep
        regex: true
      <span class="token operator">-</span> source_labels: <span class="token punctuation">[</span>__meta_kubernetes_service_annotation_prometheus_io_path<span class="token punctuation">]</span>
        action: replace
        target_label: __metrics_path__
        regex: <span class="token punctuation">(</span><span class="token punctuation">.</span><span class="token operator">+</span><span class="token punctuation">)</span>
      <span class="token operator">-</span> source_labels: <span class="token punctuation">[</span>__address__<span class="token punctuation">,</span> __meta_kubernetes_service_annotation_prometheus_io_port<span class="token punctuation">]</span>
        action: replace
        target_label: __address__
        regex: <span class="token punctuation">(</span><span class="token punctuation">[</span>^:<span class="token punctuation">]</span><span class="token operator">+</span><span class="token punctuation">)</span><span class="token punctuation">(</span>?::\\d+<span class="token punctuation">)</span>?<span class="token punctuation">;</span><span class="token punctuation">(</span>\\d+<span class="token punctuation">)</span>
        replacement: <span class="token variable">$1</span>:<span class="token variable">$2</span>    
      <span class="token operator">-</span> source_labels: <span class="token punctuation">[</span>__meta_kubernetes_namespace<span class="token punctuation">]</span>
        action: replace
        target_label: kubernetes_namespace
      <span class="token operator">-</span> source_labels: <span class="token punctuation">[</span>__meta_kubernetes_service_name<span class="token punctuation">]</span>
        action: replace
        target_label: kubernetes_name
      <span class="token operator">-</span> source_labels: <span class="token punctuation">[</span>__meta_kubernetes_pod_name<span class="token punctuation">]</span>
        action: replace
        target_label: kubernetes_pod_name   
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>验证一下：</p><p>更新configmap并重启Prometheus服务，查看target列表。</p><h6 id="kube-state-metrics监控" tabindex="-1"><a class="header-anchor" href="#kube-state-metrics监控" aria-hidden="true">#</a> kube-state-metrics监控</h6><p>已经有了cadvisor，容器运行的指标已经可以获取到，但是下面这种情况却无能为力：</p><ul><li>我调度了多少个replicas？现在可用的有几个？</li><li>多少个Pod是running/stopped/terminated状态？</li><li>Pod重启了多少次？</li></ul><p>而这些则是kube-state-metrics提供的内容，它基于client-go开发，轮询Kubernetes API，并将Kubernetes的结构化信息转换为metrics。因此，需要借助于<code>kube-state-metrics</code>来实现。</p><p>指标类别包括：</p><ul><li>CronJob Metrics</li><li>DaemonSet Metrics</li><li>Deployment Metrics</li><li>Job Metrics</li><li>LimitRange Metrics</li><li>Node Metrics</li><li>PersistentVolume Metrics</li><li>PersistentVolumeClaim Metrics</li><li>Pod Metrics <ul><li>kube_pod_info</li><li>kube_pod_owner</li><li>kube_pod_status_phase</li><li>kube_pod_status_ready</li><li>kube_pod_status_scheduled</li><li>kube_pod_container_status_waiting</li><li>kube_pod_container_status_terminated_reason</li><li>...</li></ul></li><li>Pod Disruption Budget Metrics</li><li>ReplicaSet Metrics</li><li>ReplicationController Metrics</li><li>ResourceQuota Metrics</li><li>Service Metrics</li><li>StatefulSet Metrics</li><li>Namespace Metrics</li><li>Horizontal Pod Autoscaler Metrics</li><li>Endpoint Metrics</li><li>Secret Metrics</li><li>ConfigMap Metrics</li></ul><p>部署： https://github.com/kubernetes/kube-state-metrics#kubernetes-deployment</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ wget https:<span class="token operator">/</span><span class="token operator">/</span>github<span class="token punctuation">.</span>com/kubernetes/kube-state-metrics/archive/v1<span class="token punctuation">.</span>9<span class="token punctuation">.</span>7<span class="token punctuation">.</span>tar<span class="token punctuation">.</span>gz

$ tar zxf v1<span class="token punctuation">.</span>9<span class="token punctuation">.</span>7<span class="token punctuation">.</span>tar<span class="token punctuation">.</span>gz
$ <span class="token function">cp</span> <span class="token operator">-</span>r  kube-state-metrics-1<span class="token punctuation">.</span>9<span class="token punctuation">.</span>7/examples/standard/ <span class="token punctuation">.</span>

$ ll standard/
total 20
<span class="token operator">-</span>rw-r-<span class="token operator">-</span>r-<span class="token operator">-</span> 1 root root  377 Jul 24 06:12 cluster-role-binding<span class="token punctuation">.</span>yaml
<span class="token operator">-</span>rw-r-<span class="token operator">-</span>r-<span class="token operator">-</span> 1 root root 1651 Jul 24 06:12 cluster-role<span class="token punctuation">.</span>yaml
<span class="token operator">-</span>rw-r-<span class="token operator">-</span>r-<span class="token operator">-</span> 1 root root 1069 Jul 24 06:12 deployment<span class="token punctuation">.</span>yaml
<span class="token operator">-</span>rw-r-<span class="token operator">-</span>r-<span class="token operator">-</span> 1 root root  193 Jul 24 06:12 service-account<span class="token punctuation">.</span>yaml
<span class="token operator">-</span>rw-r-<span class="token operator">-</span>r-<span class="token operator">-</span> 1 root root  406 Jul 24 06:12 service<span class="token punctuation">.</span>yaml

<span class="token comment"># 替换namespace为monitor</span>
$ sed <span class="token operator">-</span>i <span class="token string">&#39;s/namespace: kube-system/namespace: monitor/g&#39;</span> standard/<span class="token operator">*</span>

$ kubectl create <span class="token operator">-</span>f standard/
clusterrolebinding<span class="token punctuation">.</span>rbac<span class="token punctuation">.</span>authorization<span class="token punctuation">.</span>k8s<span class="token punctuation">.</span>io/kube-state-metrics created
clusterrole<span class="token punctuation">.</span>rbac<span class="token punctuation">.</span>authorization<span class="token punctuation">.</span>k8s<span class="token punctuation">.</span>io/kube-state-metrics created
deployment<span class="token punctuation">.</span>apps/kube-state-metrics created
serviceaccount/kube-state-metrics created
service/kube-state-metrics created
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如何添加到Prometheus监控target中？</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ <span class="token function">cat</span> standard/service<span class="token punctuation">.</span>yaml
apiVersion: v1
kind: Service
metadata:
  annotations:
    prometheus<span class="token punctuation">.</span>io/scrape: <span class="token string">&quot;true&quot;</span>
    prometheus<span class="token punctuation">.</span>io/port: <span class="token string">&quot;8080&quot;</span>
  labels:
    app<span class="token punctuation">.</span>kubernetes<span class="token punctuation">.</span>io/name: kube-state-metrics
    app<span class="token punctuation">.</span>kubernetes<span class="token punctuation">.</span>io/version: v1<span class="token punctuation">.</span>9<span class="token punctuation">.</span>7
  name: kube-state-metrics
  namespace: monitor
spec:
  clusterIP: None
  ports:
  <span class="token operator">-</span> name: http-metrics
    port: 8080
    targetPort: http-metrics
  <span class="token operator">-</span> name: telemetry
    port: 8081
    targetPort: telemetry
  selector:
    app<span class="token punctuation">.</span>kubernetes<span class="token punctuation">.</span>io/name: kube-state-metrics
    
$ kubectl apply <span class="token operator">-</span>f standard/service<span class="token punctuation">.</span>yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>查看target列表，观察是否存在kube-state-metrics的target。</p><p>kube_pod_container_status_running</p><p>kube_deployment_status_replicas</p><h5 id="grafana" tabindex="-1"><a class="header-anchor" href="#grafana" aria-hidden="true">#</a> Grafana</h5><p>可视化面板，功能齐全的度量仪表盘和图形编辑器，支持 Graphite、zabbix、InfluxDB、Prometheus、OpenTSDB、Elasticsearch 等作为数据源，比 Prometheus 自带的图表展示功能强大太多，更加灵活，有丰富的插件，功能更加强大。</p><h6 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h6><p>注意点：</p><ul><li>使用最新版本的镜像 https://github.com/grafana/grafana</li><li>通过环境变量设置管理员账户密码 <ul><li>GF_SECURITY_ADMIN_USER</li><li>GF_SECURITY_ADMIN_PASSWORD</li></ul></li><li>通过设置securityContext的方式让grafana进程使用root启动</li><li>数据挂载到本地</li><li>配置ingress暴露访问入口</li></ul><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ <span class="token function">cat</span> grafana-all<span class="token punctuation">.</span>yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grafana
  namespace: monitor
spec:
  selector:
    matchLabels:
      app: grafana
  template:
    metadata:
      labels:
        app: grafana
    spec:
      volumes:
      <span class="token operator">-</span> name: storage
        hostPath:
          path: <span class="token operator">/</span><span class="token keyword">data</span><span class="token operator">/</span>grafana/
      nodeSelector:
        app: prometheus
      securityContext:
        runAsUser: 0
      containers:
      <span class="token operator">-</span> name: grafana
        <span class="token comment">#image: grafana/grafana:8.2.6</span>
        image: grafana/grafana:7<span class="token punctuation">.</span>1<span class="token punctuation">.</span>1
        imagePullPolicy: IfNotPresent
        ports:
        <span class="token operator">-</span> containerPort: 3000
          name: grafana
        env:
        <span class="token operator">-</span> name: GF_SECURITY_ADMIN_USER
          value: admin
        <span class="token operator">-</span> name: GF_SECURITY_ADMIN_PASSWORD
          value: ading_25
        readinessProbe:
          failureThreshold: 10
          httpGet:
            path: <span class="token operator">/</span>api/health
            port: 3000
            scheme: HTTP
          initialDelaySeconds: 60
          periodSeconds: 10
          successThreshold: 1
          timeoutSeconds: 30
        livenessProbe:
          failureThreshold: 3
          httpGet:
            path: <span class="token operator">/</span>api/health
            port: 3000
            scheme: HTTP
          periodSeconds: 10
          successThreshold: 1
          timeoutSeconds: 1
        resources:
          limits:
            cpu: 150m
            memory: 512Mi
          requests:
            cpu: 150m
            memory: 512Mi
        volumeMounts:
        <span class="token operator">-</span> mountPath:  
          name: storage
<span class="token operator">--</span><span class="token operator">-</span>
apiVersion: v1
kind: Service
metadata:
  name: grafana
  namespace: monitor
spec:
  <span class="token function">type</span>: ClusterIP
  ports:
    <span class="token operator">-</span> port: 3000
  selector:
    app: grafana

<span class="token operator">--</span><span class="token operator">-</span>
apiVersion: networking<span class="token punctuation">.</span>k8s<span class="token punctuation">.</span>io/v1
kind: Ingress
metadata:
  name: grafana
  namespace: monitor
spec:
  rules:
  <span class="token operator">-</span> host: grafana<span class="token punctuation">.</span>nohi<span class="token punctuation">.</span>com
    http:
      paths:
      <span class="token operator">-</span> path: <span class="token operator">/</span>       
        pathType: Prefix
        backend:
          service:
            name: grafana
            port:
              number: 3000
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><p>Grafana:8.2.6 安装插件，报[Missing plugin signature]<code>Missing signature</code></p><p>后续又出现其他错误，版本改为7.1.1</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># /etc/grafana/grafana.ini 增加如下配置，多个插件以逗号分隔
allow_loading_unsigned_plugins = aliyun-log-service-datasource
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><p>配置数据源：</p><ul><li>URL：http://prometheus:9090</li></ul><p>如何丰富Grafana监控面板：</p><ul><li>导入dashboard</li><li>安装相应的插件</li><li>自定义监控面板</li></ul><h6 id="导入dashboard的配置" tabindex="-1"><a class="header-anchor" href="#导入dashboard的配置" aria-hidden="true">#</a> 导入Dashboard的配置</h6><p>dashboard： https://grafana.com/grafana/dashboards</p><ul><li>Node Exporter https://grafana.com/grafana/dashboards/8919</li><li>Prometheus： https://grafana.com/grafana/dashboards/8588 废弃</li></ul><h6 id="devopsprodigy-kubegraf插件的使用" tabindex="-1"><a class="header-anchor" href="#devopsprodigy-kubegraf插件的使用" aria-hidden="true">#</a> DevOpsProdigy KubeGraf插件的使用</h6>`,212),sn={href:"https://grafana.com/grafana/plugins?utm_source=grafana_plugin_list",target:"_blank",rel:"noopener noreferrer"},an=n("p",null,"Kubernetes相关的插件：",-1),en={href:"https://grafana.com/grafana/plugins/grafana-kubernetes-app",target:"_blank",rel:"noopener noreferrer"},tn={href:"https://grafana.com/grafana/plugins/devopsprodigy-kubegraf-app",target:"_blank",rel:"noopener noreferrer"},ln={href:"https://grafana.com/grafana/plugins/devopsprodigy-kubegraf-app",target:"_blank",rel:"noopener noreferrer"},pn=t(`<div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token comment"># 进入grafana容器内部执行安装</span>
$ kubectl <span class="token operator">-</span>n monitor exec <span class="token operator">-</span>ti grafana-594f447d6c-jmjsw bash
bash-5<span class="token punctuation">.</span>0<span class="token comment"># grafana-cli plugins install devopsprodigy-kubegraf-app 1.4.1</span>
installing devopsprodigy-kubegraf-app @ 1<span class="token punctuation">.</span>4<span class="token punctuation">.</span>1
<span class="token keyword">from</span>: https:<span class="token operator">/</span><span class="token operator">/</span>grafana<span class="token punctuation">.</span>com/api/plugins/devopsprodigy-kubegraf-app/versions/1<span class="token punctuation">.</span>4<span class="token punctuation">.</span>1/download
into: <span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>lib/grafana/plugins

✔ Installed devopsprodigy-kubegraf-app successfully

Restart grafana after installing plugins <span class="token punctuation">.</span> &lt;service grafana-server restart&gt;

bash-5<span class="token punctuation">.</span>0<span class="token comment"># grafana-cli plugins install grafana-piechart-panel</span>
installing grafana-piechart-panel @ 1<span class="token punctuation">.</span>5<span class="token punctuation">.</span>0
<span class="token keyword">from</span>: https:<span class="token operator">/</span><span class="token operator">/</span>grafana<span class="token punctuation">.</span>com/api/plugins/grafana-piechart-panel/versions/1<span class="token punctuation">.</span>5<span class="token punctuation">.</span>0/download
into: <span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>lib/grafana/plugins

✔ Installed grafana-piechart-panel successfully

Restart grafana after installing plugins <span class="token punctuation">.</span> &lt;service grafana-server restart&gt;

<span class="token comment"># 也可以下载离线包进行安装</span>

<span class="token comment"># 重建pod生效</span>
$ kubectl <span class="token operator">-</span>n monitor delete po grafana-594f447d6c-jmjsw
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li></li></ul><p>登录grafana界面，Configuration -&gt; Plugins 中找到安装的插件，点击插件进入插件详情页面，点击 [Enable]按钮启用插件，点击 <code>Set up your first k8s-cluster</code> 创建一个新的 Kubernetes 集群:</p><ul><li><p>Name：nohi-k8s</p></li><li><p>URL：https://kubernetes.default:443</p></li><li><p>Access：使用默认的Server(default)</p></li><li><p>Skip TLS Verify：勾选，跳过证书合法性校验</p></li><li><p>Auth：勾选TLS Client Auth以及With CA Cert，勾选后会下面有三块证书内容需要填写，内容均来自<code>~/.kube/config</code>文件，需要对文件中的内容做一次base64 解码</p><ul><li>CA Cert：使用config文件中的<code>certificate-authority-data</code>对应的内容</li><li>Client Cert：使用config文件中的<code>client-certificate-data</code>对应的内容</li><li>Client Key：使用config文件中的<code>client-key-data</code>对应的内容</li></ul></li></ul><h6 id="自定义监控面板" tabindex="-1"><a class="header-anchor" href="#自定义监控面板" aria-hidden="true">#</a> 自定义监控面板</h6><p>通用的监控需求基本上都可以使用第三方的Dashboard来解决，对于业务应用自己实现的指标的监控面板，则需要我们手动进行创建。</p><p>调试Panel：直接输入Metrics，查询数据。</p><p>如，输入<code>node_load1</code>来查看集群节点最近1分钟的平均负载，直接保存即可生成一个panel</p><p>如何根据字段过滤，实现联动效果？</p><p>比如想实现根据集群节点名称进行过滤，可以通过如下方式：</p><ul><li><p>设置 -&gt; Variables -&gt; Add Variable，添加一个变量node，</p><ul><li>Name：node</li><li>Label：选择节点</li><li>Data Source：Prometheus</li><li>Query：kube_node_info，可以在页面下方的<code>Preview of values</code>查看到当前变量的可选值</li><li>Regex：<code>/.*node=\\&quot;(.+?)\\&quot;.*/</code></li><li>Refresh：<code>On Dashboard Load</code></li><li>Multi-value：true</li><li>Include All Options：true</li></ul></li><li><p>修改Metrics，$node和变量名字保持一致，意思为自动读取当前设置的节点的名字</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>node_load1<span class="token punctuation">{</span>instance=~<span class="token string">&quot;<span class="token variable">$node</span>&quot;</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li></ul><p>再添加一个面板，使用如下的表达式：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>100-avg<span class="token punctuation">(</span>irate<span class="token punctuation">(</span>node_cpu_seconds_total<span class="token punctuation">{</span>mode=<span class="token string">&quot;idle&quot;</span><span class="token punctuation">,</span>instance=~<span class="token string">&quot;<span class="token variable">$node</span>&quot;</span><span class="token punctuation">}</span><span class="token punctuation">[</span>5m<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span> by <span class="token punctuation">(</span>instance<span class="token punctuation">)</span><span class="token operator">*</span>100
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h6 id="metrics指标类型与promql" tabindex="-1"><a class="header-anchor" href="#metrics指标类型与promql" aria-hidden="true">#</a> Metrics指标类型与PromQL</h6><p>TSDB的样本分布示意图：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>  ^
  │   <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span>   <span class="token punctuation">.</span> <span class="token punctuation">.</span>   node_cpu<span class="token punctuation">{</span>cpu=<span class="token string">&quot;cpu0&quot;</span><span class="token punctuation">,</span>mode=<span class="token string">&quot;idle&quot;</span><span class="token punctuation">}</span>
  │     <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span>   node_cpu<span class="token punctuation">{</span>cpu=<span class="token string">&quot;cpu0&quot;</span><span class="token punctuation">,</span>mode=<span class="token string">&quot;system&quot;</span><span class="token punctuation">}</span>
  │     <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span>   <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span>   node_load1<span class="token punctuation">{</span><span class="token punctuation">}</span>
  │     <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span>   <span class="token punctuation">.</span> <span class="token punctuation">.</span>   node_cpu_seconds_total<span class="token punctuation">{</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">}</span>
  v
    &lt;<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span> 时间 <span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span>&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Guage类型：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ kubectl <span class="token operator">-</span>n monitor get po <span class="token operator">-</span>o wide <span class="token punctuation">|</span>grep k8s-master
node-exporter-ld6sq    1/1     Running   0          4d3h    172<span class="token punctuation">.</span>21<span class="token punctuation">.</span>51<span class="token punctuation">.</span>67   k8s-master
$ curl <span class="token operator">-</span>s  172<span class="token punctuation">.</span>21<span class="token punctuation">.</span>51<span class="token punctuation">.</span>67:9100/metrics <span class="token punctuation">|</span>grep node_load1
<span class="token comment"># HELP node_load1 1m load average.</span>
<span class="token comment"># TYPE node_load1 gauge</span>
node_load1 0<span class="token punctuation">.</span>18
<span class="token comment"># HELP node_load15 15m load average.</span>
<span class="token comment"># TYPE node_load15 gauge</span>
node_load15 0<span class="token punctuation">.</span>37
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Gauge类型的指标侧重于反应系统的当前状态。</p><ul><li>这类指标的样本数据可增可减。</li><li>常见指标如：node_memory_MemAvailable_bytes（可用内存大小）、node_load1（系统平均负载）</li></ul><p>Guage类型的数据，通常直接查询就会有比较直观的业务含义，比如：</p><ul><li>node_load5</li><li>node_memory_MemAvailable_bytes</li></ul><p>我们也会对这类数据做简单的处理，比如：</p><ul><li>过滤其中某些节点</li><li>对指标进行数学运算</li></ul><p>这就是PromQL提供的能力，可以对收集到的数据做聚合、计算等处理。</p><p>PromQL（ Prometheus Query Language ）是Prometheus自定义的一套强大的数据查询语言，除了使用监控指标作为查询关键字以为，还内置了大量的函数，帮助用户进一步对时序数据进行处理。</p><p>比如：</p><ul><li><p>只显示k8s-master节点的平均负载</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>node_load1<span class="token punctuation">{</span>instance=<span class="token string">&quot;k8s-master&quot;</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li><li><p>显示除了k8s-master节点外的其他节点的平均负载</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>node_load1<span class="token punctuation">{</span>instance!=<span class="token string">&quot;k8s-master&quot;</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li><li><p>正则匹配</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>node_load1<span class="token punctuation">{</span>instance=~<span class="token string">&quot;k8s-master|k8s-worker1&quot;</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li><li><p>集群各节点系统内存使用率</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token punctuation">(</span>node_memory_MemTotal_bytes <span class="token operator">-</span> node_memory_MemFree_bytes<span class="token punctuation">)</span> <span class="token operator">/</span> node_memory_MemTotal_bytes
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li></ul><p>counter类型：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ curl <span class="token operator">-</span>s  172<span class="token punctuation">.</span>21<span class="token punctuation">.</span>51<span class="token punctuation">.</span>67:9100/metrics <span class="token punctuation">|</span>grep node_cpu_seconds_total
<span class="token comment"># HELP node_cpu_seconds_total Seconds the cpus spent in each mode.</span>
<span class="token comment"># TYPE node_cpu_seconds_total counter</span>
node_cpu_seconds_total<span class="token punctuation">{</span>cpu=<span class="token string">&quot;0&quot;</span><span class="token punctuation">,</span>mode=<span class="token string">&quot;idle&quot;</span><span class="token punctuation">}</span> 294341<span class="token punctuation">.</span>02
node_cpu_seconds_total<span class="token punctuation">{</span>cpu=<span class="token string">&quot;0&quot;</span><span class="token punctuation">,</span>mode=<span class="token string">&quot;iowait&quot;</span><span class="token punctuation">}</span> 120<span class="token punctuation">.</span>78
node_cpu_seconds_total<span class="token punctuation">{</span>cpu=<span class="token string">&quot;0&quot;</span><span class="token punctuation">,</span>mode=<span class="token string">&quot;irq&quot;</span><span class="token punctuation">}</span> 0
node_cpu_seconds_total<span class="token punctuation">{</span>cpu=<span class="token string">&quot;0&quot;</span><span class="token punctuation">,</span>mode=<span class="token string">&quot;nice&quot;</span><span class="token punctuation">}</span> 0<span class="token punctuation">.</span>13
node_cpu_seconds_total<span class="token punctuation">{</span>cpu=<span class="token string">&quot;0&quot;</span><span class="token punctuation">,</span>mode=<span class="token string">&quot;softirq&quot;</span><span class="token punctuation">}</span> 1263<span class="token punctuation">.</span>29
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>counter类型的指标其工作方式和计数器一样，只增不减（除非系统发生重置）。常见的监控指标，如http_requests_total，node_cpu_seconds_total都是Counter类型的监控指标。</p><p>通常计数器类型的指标，名称后面都以<code>_total</code>结尾。我们通过理解CPU利用率的PromQL表达式来讲解Counter指标类型的使用。</p><p>各节点CPU的平均使用率表达式：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token punctuation">(</span>1- sum<span class="token punctuation">(</span>increase<span class="token punctuation">(</span>node_cpu_seconds_total<span class="token punctuation">{</span>mode=<span class="token string">&quot;idle&quot;</span><span class="token punctuation">}</span><span class="token punctuation">[</span>2m<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span> by <span class="token punctuation">(</span>instance<span class="token punctuation">)</span> <span class="token operator">/</span> sum<span class="token punctuation">(</span>increase<span class="token punctuation">(</span>node_cpu_seconds_total<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">[</span>2m<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span> by <span class="token punctuation">(</span>instance<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">*</span> 100
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>分析：</p><p><code>node_cpu_seconds_total</code>的指标含义是统计系统运行以来，CPU资源分配的时间总数，单位为秒，是累加的值。比如，直接运行该指标：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>node_cpu_seconds_total
<span class="token comment"># 显示的是所有节点、所有CPU核心、在各种工作模式下分配的时间总和</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>其中mode的值和我们平常在系统中执行<code>top</code>命令看到的CPU显示的信息一致：</p><p>每个mode对应的含义如下：</p><ul><li><code>user</code>(us) 表示用户态空间或者说是用户进程(running user space processes)使用CPU所耗费的时间。这是日常我们部署的应用所在的层面，最常见常用。</li><li><code>system</code>(sy) 表示内核态层级使用CPU所耗费的时间。分配内存、IO操作、创建子进程……都是内核操作。这也表明，当IO操作频繁时，System参数会很高。</li><li><code>steal</code>(st) 当运行在虚拟化环境中，花费在其它 OS 中的时间（基于虚拟机监视器 hypervisor 的调度）；可以理解成由于虚拟机调度器将 cpu 时间用于其它 OS 了，故当前 OS 无法使用 CPU 的时间。</li><li><code>softirq</code>(si) 从系统启动开始，累计到当前时刻，软中断时间</li><li><code>irq</code>(hi) 从系统启动开始，累计到当前时刻，硬中断时间</li><li><code>nice</code>(ni) 从系统启动开始，累计到当前时刻， 低优先级(低优先级意味着进程 nice 值小于 0)用户态的进程所占用的CPU时间</li><li><code>iowait</code>(wa) 从系统启动开始，累计到当前时刻，IO等待时间</li><li><code>idle</code>(id) 从系统启动开始，累计到当前时刻，除IO等待时间以外的其它等待时间，亦即空闲时间</li></ul><p>我们通过指标拿到的各核心cpu分配的总时长数据，都是瞬时的数据，如何转换成 CPU的利用率？</p><p>先来考虑如何我们如何计算CPU利用率，假如我的k8s-master节点是4核CPU，我们来考虑如下场景：</p><ul><li>过去1分钟内每个CPU核心处于idle状态的时长，假如分别为 : <ul><li>cpu0：20s</li><li>cpu1：30s</li><li>cpu2：50s</li><li>cpu3：40s</li></ul></li><li>则四个核心总共可分配的时长是 4*60=240s</li><li>实际空闲状态的总时长为20+30+50+40=140s</li><li>那么我们可以计算出过去1分钟k8s-master节点的CPU利用率为 (1- 140/240) * 100 = 41.7%</li></ul><p>因此，我们只需要使用PromQL取出上述过程中的值即可：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token comment"># 过滤出当前时间点idle的时长</span>
node_cpu_seconds_total<span class="token punctuation">{</span>mode=<span class="token string">&quot;idle&quot;</span><span class="token punctuation">}</span>

<span class="token comment"># 使用[1m]取出1分钟区间内的样本值,注意，1m区间要大于prometheus设置的抓取周期，此处会将周期内所以的样本值取出</span>
node_cpu_seconds_total<span class="token punctuation">{</span>mode=<span class="token string">&quot;idle&quot;</span><span class="token punctuation">}</span><span class="token punctuation">[</span>1m<span class="token punctuation">]</span>

<span class="token comment"># 使用increase方法，获取该区间内idle状态的增量值,即1分钟内，mode=&quot;idle&quot;状态增加的时长</span>
increase<span class="token punctuation">(</span>node_cpu_seconds_total<span class="token punctuation">{</span>mode=<span class="token string">&quot;idle&quot;</span><span class="token punctuation">}</span><span class="token punctuation">[</span>1m<span class="token punctuation">]</span><span class="token punctuation">)</span>

<span class="token comment"># 由于是多个cpu核心，因此需要做累加，使用sum函数</span>
sum<span class="token punctuation">(</span>increase<span class="token punctuation">(</span>node_cpu_seconds_total<span class="token punctuation">{</span>mode=<span class="token string">&quot;idle&quot;</span><span class="token punctuation">}</span><span class="token punctuation">[</span>1m<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span>

<span class="token comment"># 由于是多台机器，因此，需要按照instance的值进行分组累加，使用by关键字做分组,这样就获得了1分钟内，每个节点上 所有CPU核心idle状态的增量时长，即前面示例中的”20+30+50+40=140s“</span>
sum<span class="token punctuation">(</span>increase<span class="token punctuation">(</span>node_cpu_seconds_total<span class="token punctuation">{</span>mode=<span class="token string">&quot;idle&quot;</span><span class="token punctuation">}</span><span class="token punctuation">[</span>1m<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span> by <span class="token punctuation">(</span>instance<span class="token punctuation">)</span>

<span class="token comment"># 去掉mode=idle的过滤条件，即可获取1分钟内，所有状态的cpu获得的增量总时长，即4*60=240s</span>
sum<span class="token punctuation">(</span>increase<span class="token punctuation">(</span>node_cpu_seconds_total<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">[</span>1m<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span> by <span class="token punctuation">(</span>instance<span class="token punctuation">)</span>

<span class="token comment"># 最终的语句</span>
<span class="token punctuation">(</span>1- sum<span class="token punctuation">(</span>increase<span class="token punctuation">(</span>node_cpu_seconds_total<span class="token punctuation">{</span>mode=<span class="token string">&quot;idle&quot;</span><span class="token punctuation">}</span><span class="token punctuation">[</span>1m<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span> by <span class="token punctuation">(</span>instance<span class="token punctuation">)</span> <span class="token operator">/</span> sum<span class="token punctuation">(</span>increase<span class="token punctuation">(</span>node_cpu_seconds_total<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">[</span>1m<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span> by <span class="token punctuation">(</span>instance<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">*</span> 100
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>除此之外，还会经常看到irate和rate方法的使用：</p><p><code>irate()</code> 是基于最后两个数据点计算一个时序指标在一个范围内的每秒递增率 ，举个例子：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token comment"># 1min内，k8s-master节点的idle状态的cpu分配时长增量值</span>
increase<span class="token punctuation">(</span>node_cpu_seconds_total<span class="token punctuation">{</span>instance=<span class="token string">&quot;k8s-master&quot;</span><span class="token punctuation">,</span>mode=<span class="token string">&quot;idle&quot;</span><span class="token punctuation">}</span><span class="token punctuation">[</span>1m<span class="token punctuation">]</span><span class="token punctuation">)</span>

<span class="token punctuation">{</span>cpu=<span class="token string">&quot;0&quot;</span><span class="token punctuation">,</span>instance=<span class="token string">&quot;k8s-master&quot;</span><span class="token punctuation">,</span>job=<span class="token string">&quot;kubernetes-sd-node-exporter&quot;</span><span class="token punctuation">,</span>mode=<span class="token string">&quot;idle&quot;</span><span class="token punctuation">}</span>	56<span class="token punctuation">.</span>5
<span class="token punctuation">{</span>cpu=<span class="token string">&quot;1&quot;</span><span class="token punctuation">,</span>instance=<span class="token string">&quot;k8s-master&quot;</span><span class="token punctuation">,</span>job=<span class="token string">&quot;kubernetes-sd-node-exporter&quot;</span><span class="token punctuation">,</span>mode=<span class="token string">&quot;idle&quot;</span><span class="token punctuation">}</span>	56<span class="token punctuation">.</span>04
<span class="token punctuation">{</span>cpu=<span class="token string">&quot;2&quot;</span><span class="token punctuation">,</span>instance=<span class="token string">&quot;k8s-master&quot;</span><span class="token punctuation">,</span>job=<span class="token string">&quot;kubernetes-sd-node-exporter&quot;</span><span class="token punctuation">,</span>mode=<span class="token string">&quot;idle&quot;</span><span class="token punctuation">}</span>	56<span class="token punctuation">.</span>6
<span class="token punctuation">{</span>cpu=<span class="token string">&quot;3&quot;</span><span class="token punctuation">,</span>instance=<span class="token string">&quot;k8s-master&quot;</span><span class="token punctuation">,</span>job=<span class="token string">&quot;kubernetes-sd-node-exporter&quot;</span><span class="token punctuation">,</span>mode=<span class="token string">&quot;idle&quot;</span><span class="token punctuation">}</span>	56<span class="token punctuation">.</span>5

<span class="token comment">#以第一条数据为例，说明过去的1分钟，k8s-master节点的第一个CPU核心，有56.5秒的时长是出于idle状态的</span>

<span class="token comment"># 1min内，k8s-master节点的idle状态的cpu分配每秒的速率</span>
irate<span class="token punctuation">(</span>node_cpu_seconds_total<span class="token punctuation">{</span>instance=<span class="token string">&quot;k8s-master&quot;</span><span class="token punctuation">,</span>mode=<span class="token string">&quot;idle&quot;</span><span class="token punctuation">}</span><span class="token punctuation">[</span>1m<span class="token punctuation">]</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>cpu=<span class="token string">&quot;0&quot;</span><span class="token punctuation">,</span>instance=<span class="token string">&quot;k8s-master&quot;</span><span class="token punctuation">,</span>job=<span class="token string">&quot;kubernetes-sd-node-exporter&quot;</span><span class="token punctuation">,</span>mode=<span class="token string">&quot;idle&quot;</span><span class="token punctuation">}</span>	0<span class="token punctuation">.</span>934
<span class="token punctuation">{</span>cpu=<span class="token string">&quot;1&quot;</span><span class="token punctuation">,</span>instance=<span class="token string">&quot;k8s-master&quot;</span><span class="token punctuation">,</span>job=<span class="token string">&quot;kubernetes-sd-node-exporter&quot;</span><span class="token punctuation">,</span>mode=<span class="token string">&quot;idle&quot;</span><span class="token punctuation">}</span>	0<span class="token punctuation">.</span>932
<span class="token punctuation">{</span>cpu=<span class="token string">&quot;2&quot;</span><span class="token punctuation">,</span>instance=<span class="token string">&quot;k8s-master&quot;</span><span class="token punctuation">,</span>job=<span class="token string">&quot;kubernetes-sd-node-exporter&quot;</span><span class="token punctuation">,</span>mode=<span class="token string">&quot;idle&quot;</span><span class="token punctuation">}</span>	0<span class="token punctuation">.</span>933
<span class="token punctuation">{</span>cpu=<span class="token string">&quot;3&quot;</span><span class="token punctuation">,</span>instance=<span class="token string">&quot;k8s-master&quot;</span><span class="token punctuation">,</span>job=<span class="token string">&quot;kubernetes-sd-node-exporter&quot;</span><span class="token punctuation">,</span>mode=<span class="token string">&quot;idle&quot;</span><span class="token punctuation">}</span>	0<span class="token punctuation">.</span>936
<span class="token comment"># 该值如何计算的？</span>
<span class="token comment"># irate会取出样本中的最后两个点来作为增长依据，然后做差值计算，并且除以两个样本间的数据时长，也就是说，我们设置2m,5m取出来的值是一样的，因为只会计算最后两个样本差。</span>
<span class="token comment"># 以第一条数据为例，表示用irate计算出来的结果是，过去的两分钟内，cpu平均每秒钟有0.934秒的时间是处于idle状态的</span>


<span class="token comment"># rate会1min内第一个和最后一个样本值为依据，计算方式和irate保持一致</span>
rate<span class="token punctuation">(</span>node_cpu_seconds_total<span class="token punctuation">{</span>instance=<span class="token string">&quot;k8s-master&quot;</span><span class="token punctuation">,</span>mode=<span class="token string">&quot;idle&quot;</span><span class="token punctuation">}</span><span class="token punctuation">[</span>1m<span class="token punctuation">]</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>cpu=<span class="token string">&quot;0&quot;</span><span class="token punctuation">,</span>instance=<span class="token string">&quot;k8s-master&quot;</span><span class="token punctuation">,</span>job=<span class="token string">&quot;kubernetes-sd-node-exporter&quot;</span><span class="token punctuation">,</span>mode=<span class="token string">&quot;idle&quot;</span><span class="token punctuation">}</span>	0<span class="token punctuation">.</span>933
<span class="token punctuation">{</span>cpu=<span class="token string">&quot;1&quot;</span><span class="token punctuation">,</span>instance=<span class="token string">&quot;k8s-master&quot;</span><span class="token punctuation">,</span>job=<span class="token string">&quot;kubernetes-sd-node-exporter&quot;</span><span class="token punctuation">,</span>mode=<span class="token string">&quot;idle&quot;</span><span class="token punctuation">}</span>	0<span class="token punctuation">.</span>940
<span class="token punctuation">{</span>cpu=<span class="token string">&quot;2&quot;</span><span class="token punctuation">,</span>instance=<span class="token string">&quot;k8s-master&quot;</span><span class="token punctuation">,</span>job=<span class="token string">&quot;kubernetes-sd-node-exporter&quot;</span><span class="token punctuation">,</span>mode=<span class="token string">&quot;idle&quot;</span><span class="token punctuation">}</span>	0<span class="token punctuation">.</span>935
<span class="token punctuation">{</span>cpu=<span class="token string">&quot;3&quot;</span><span class="token punctuation">,</span>instance=<span class="token string">&quot;k8s-master&quot;</span><span class="token punctuation">,</span>job=<span class="token string">&quot;kubernetes-sd-node-exporter&quot;</span><span class="token punctuation">,</span>mode=<span class="token string">&quot;idle&quot;</span><span class="token punctuation">}</span>	0<span class="token punctuation">.</span>937
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>因此rate的值，相对来讲更平滑，因为计算的是时间段内的平均，更适合于用作告警。</p><h5 id="alertmanager" tabindex="-1"><a class="header-anchor" href="#alertmanager" aria-hidden="true">#</a> Alertmanager</h5><p>Alertmanager是一个独立的告警模块。</p><ul><li>接收Prometheus等客户端发来的警报</li><li>通过分组、删除重复等处理，并将它们通过路由发送给正确的接收器；</li><li>告警方式可以按照不同的规则发送给不同的模块负责人。Alertmanager支持Email, Slack，等告警方式, 也可以通过webhook接入钉钉等国内IM工具。</li></ul><p><img src="`+p+`" alt=""></p><p>如果集群主机的内存使用率超过80%，且该现象持续了2分钟？想实现这样的监控告警，如何做？</p><p>从上图可得知设置警报和通知的主要步骤是：</p><ul><li><p>安装和配置 Alertmanager</p></li><li><p>配置Prometheus与Alertmanager对话</p></li><li><p>在Prometheus中创建警报规则</p></li></ul><h6 id="安装-1" tabindex="-1"><a class="header-anchor" href="#安装-1" aria-hidden="true">#</a> 安装</h6><p>Alertmanager， https://github.com/prometheus/alertmanager#install</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token punctuation">.</span><span class="token operator">/</span>alertmanager <span class="token operator">--</span>config<span class="token punctuation">.</span>file=config<span class="token punctuation">.</span>yml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>alertmanager.yml配置文件格式：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ <span class="token function">cat</span> alertmanager-config<span class="token punctuation">.</span>yml
apiVersion: v1
<span class="token keyword">data</span>:
  config<span class="token punctuation">.</span>yml: <span class="token punctuation">|</span>
    global:
      <span class="token comment"># 当alertmanager持续多长时间未接收到告警后标记告警状态为 resolved</span>
      resolve_timeout: 5m
      <span class="token comment"># 配置邮件发送信息</span>
      smtp_smarthost: <span class="token string">&#39;smtp.163.com:25&#39;</span>
      smtp_from: <span class="token string">&#39;xxx@163.com&#39;</span>
      smtp_auth_username: <span class="token string">&#39;xxx@163.com&#39;</span>
      smtp_auth_password: <span class="token string">&#39;xxx&#39;</span>
      smtp_require_tls: false
    <span class="token comment"># 所有报警信息进入后的根路由，用来设置报警的分发策略</span>
    route:
      <span class="token comment"># 接收到的报警信息里面有许多alertname=NodeLoadHigh 这样的标签的报警信息将会批量被聚合到一个分组里面</span>
      group_by: <span class="token punctuation">[</span><span class="token string">&#39;alertname&#39;</span><span class="token punctuation">]</span>
      <span class="token comment"># 当一个新的报警分组被创建后，需要等待至少 group_wait 时间来初始化通知，如果在等待时间内当前group接收到了新的告警，这些告警将会合并为一个通知向receiver发送</span>
      group_wait: 30s

      <span class="token comment"># 相同的group发送告警通知的时间间隔</span>
      group_interval: 30s
      <span class="token comment"># 如果一个报警信息已经发送成功了，等待 repeat_interval 时间来重新发送</span>
      repeat_interval: 1m

      <span class="token comment"># 默认的receiver：如果一个报警没有被一个route匹配，则发送给默认的接收器</span>
      receiver: default

      <span class="token comment"># 上面所有的属性都由所有子路由继承，并且可以在每个子路由上进行覆盖。</span>
      routes:
      <span class="token operator">-</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token comment"># 配置告警接收者的信息</span>
    receivers:
    <span class="token operator">-</span> name: <span class="token string">&#39;default&#39;</span>
      email_configs:
      <span class="token operator">-</span> to: <span class="token string">&#39;xxx@163.com&#39;</span>
        send_resolved: true  <span class="token comment"># 接受告警恢复的通知</span>
kind: ConfigMap
metadata:
  name: alertmanager
  namespace: monitor
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>主要配置的作用：</p>`,62),on={href:"https://prometheus.io/docs/alerting/configuration/#configuration-file",target:"_blank",rel:"noopener noreferrer"},cn={href:"https://prometheus.io/docs/alerting/configuration/#route",target:"_blank",rel:"noopener noreferrer"},un={href:"https://prometheus.io/docs/alerting/configuration/#receiver",target:"_blank",rel:"noopener noreferrer"},rn=t(`<p>配置文件：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ kubectl create <span class="token operator">-</span>f  alertmanager-config<span class="token punctuation">.</span>yml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>其他资源清单文件:</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ <span class="token function">cat</span> alertmanager-all<span class="token punctuation">.</span>yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: alertmanager
  namespace: monitor
  labels:
    app: alertmanager
spec:
  selector:
    matchLabels:
      app: alertmanager
  template:
    metadata:
      labels:
        app: alertmanager
    spec:
      volumes:
      <span class="token operator">-</span> name: config
        configMap:
          name: alertmanager
      containers:
      <span class="token operator">-</span> name: alertmanager
        image: prom/alertmanager:v0<span class="token punctuation">.</span>21<span class="token punctuation">.</span>0
        imagePullPolicy: IfNotPresent
        args:
        <span class="token operator">-</span> <span class="token string">&quot;--config.file=/etc/alertmanager/config.yml&quot;</span>
        <span class="token operator">-</span> <span class="token string">&quot;--log.level=debug&quot;</span>
        ports:
        <span class="token operator">-</span> containerPort: 9093
          name: http
        volumeMounts:
        <span class="token operator">-</span> mountPath: <span class="token string">&quot;/etc/alertmanager&quot;</span>
          name: config
        resources:
          requests:
            cpu: 100m
            memory: 256Mi
          limits:
            cpu: 100m
            memory: 256Mi
<span class="token operator">--</span><span class="token operator">-</span>
apiVersion: v1
kind: Service
metadata:
  name: alertmanager
  namespace: monitor
spec:
  <span class="token function">type</span>: ClusterIP
  ports:
    <span class="token operator">-</span> port: 9093
  selector:
    app: alertmanager

<span class="token operator">--</span><span class="token operator">-</span>
apiVersion: networking<span class="token punctuation">.</span>k8s<span class="token punctuation">.</span>io/v1
kind: Ingress
metadata:
  name: alertmanager
  namespace: monitor
spec:
  rules:
  <span class="token operator">-</span> host: alertmanager<span class="token punctuation">.</span>nohi<span class="token punctuation">.</span>com
    http:
      paths:
      <span class="token operator">-</span> path: <span class="token operator">/</span>
        pathType: Prefix
        backend:
          service:
            name: alertmanager
            port:
              number: 9093
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="配置prometheus与alertmanager对话" tabindex="-1"><a class="header-anchor" href="#配置prometheus与alertmanager对话" aria-hidden="true">#</a> 配置Prometheus与Alertmanager对话</h6><p><img src="`+p+`" alt=""></p><p>是否告警是由Prometheus进行判断的，若有告警产生，Prometheus会将告警push到Alertmanager，因此，需要在Prometheus端配置alertmanager的地址：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>    alerting:
      alertmanagers:
      <span class="token operator">-</span> static_configs:
        <span class="token operator">-</span> targets:
          <span class="token operator">-</span> alertmanager:9093
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>因此，修改Prometheus的配置文件，然后重新加载pod</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token comment"># 编辑prometheus-configmap.yaml配置，添加alertmanager内容</span>
$ vim prometheus-configmap<span class="token punctuation">.</span>yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: monitor
<span class="token keyword">data</span>:
  prometheus<span class="token punctuation">.</span>yml: <span class="token punctuation">|</span>
    global:
      scrape_interval: 30s
      evaluation_interval: 30s
    alerting:
      alertmanagers:
      <span class="token operator">-</span> static_configs:
        <span class="token operator">-</span> targets:
          <span class="token operator">-</span> alertmanager:9093
<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
  
  
$ kubectl apply <span class="token operator">-</span>f prometheus-configmap<span class="token punctuation">.</span>yaml

<span class="token comment"># 现在已经有监控数据了，因此使用prometheus提供的reload的接口，进行服务重启</span>

<span class="token comment"># 查看配置文件是否已经自动加载到pod中</span>
$ kubectl <span class="token operator">-</span>n monitor get po <span class="token operator">-</span>o wide
prometheus-dcb499cbf-pljfn            1/1     Running   0          47h    10<span class="token punctuation">.</span>244<span class="token punctuation">.</span>1<span class="token punctuation">.</span>167  

$ kubectl <span class="token operator">-</span>n monitor exec <span class="token operator">-</span>ti prometheus-dcb499cbf-pljfn <span class="token function">cat</span> <span class="token operator">/</span>etc/prometheus/prometheus<span class="token punctuation">.</span>yml <span class="token punctuation">|</span>grep alertmanager

<span class="token comment"># 使用软加载的方式，</span>
$ curl <span class="token operator">-</span>X POST 10<span class="token punctuation">.</span>244<span class="token punctuation">.</span>1<span class="token punctuation">.</span>167:9090/<span class="token operator">-</span><span class="token operator">/</span>reload
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="配置报警规则" tabindex="-1"><a class="header-anchor" href="#配置报警规则" aria-hidden="true">#</a> 配置报警规则</h6><p>目前Prometheus与Alertmanager已经连通，接下来我们可以针对收集到的各类指标配置报警规则，一旦满足报警规则的设置，则Prometheus将报警信息推送给Alertmanager，进而转发到我们配置的邮件中。</p><p>在哪里配置？同样是在prometheus-configmap中：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ vim prometheus-configmap<span class="token punctuation">.</span>yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: monitor
<span class="token keyword">data</span>:
  prometheus<span class="token punctuation">.</span>yml: <span class="token punctuation">|</span>
    global:
      scrape_interval: 10s
      evaluation_interval: 10s
    alerting:
      alertmanagers:
      <span class="token operator">-</span> static_configs:
        <span class="token operator">-</span> targets:
          <span class="token operator">-</span> alertmanager:9093
    <span class="token comment"># Load rules once and periodically evaluate them according to the global  &#39;evaluation_interval&#39;.</span>
    rule_files:
      <span class="token operator">-</span> <span class="token operator">/</span>etc/prometheus/alert_rules<span class="token punctuation">.</span>yml
      <span class="token comment"># - &quot;first_rules.yml&quot;</span>
      <span class="token comment"># - &quot;second_rules.yml&quot;</span>
    scrape_configs:
    <span class="token operator">-</span> job_name: <span class="token string">&#39;prometheus&#39;</span>
      static_configs:
      <span class="token operator">-</span> targets: <span class="token punctuation">[</span><span class="token string">&#39;localhost:9090&#39;</span><span class="token punctuation">]</span>
<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>rules.yml我们同样使用configmap的方式挂载到prometheus容器内部，因此只需要在已有的configmap中加一个数据项目</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ vim prometheus-configmap<span class="token punctuation">.</span>yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: monitor
<span class="token keyword">data</span>:
  prometheus<span class="token punctuation">.</span>yml: <span class="token punctuation">|</span>
    global:
      scrape_interval: 30s
      evaluation_interval: 30s
    alerting:
      alertmanagers:
      <span class="token operator">-</span> static_configs:
        <span class="token operator">-</span> targets:
          <span class="token operator">-</span> alertmanager:9093
    <span class="token comment"># Load rules once and periodically evaluate them according to the global  &#39;evaluation_interval&#39;.</span>
    rule_files:
      <span class="token operator">-</span> <span class="token operator">/</span>etc/prometheus/alert_rules<span class="token punctuation">.</span>yml
      <span class="token comment"># - &quot;first_rules.yml&quot;</span>
      <span class="token comment"># - &quot;second_rules.yml&quot;</span>
    scrape_configs:
    <span class="token operator">-</span> job_name: <span class="token string">&#39;prometheus&#39;</span>
      static_configs:
      <span class="token operator">-</span> targets: <span class="token punctuation">[</span><span class="token string">&#39;localhost:9090&#39;</span><span class="token punctuation">]</span>
<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> <span class="token comment"># 省略中间部分</span>
  alert_rules<span class="token punctuation">.</span>yml: <span class="token punctuation">|</span>
    groups:
    <span class="token operator">-</span> name: node_metrics
      rules:
      <span class="token operator">-</span> alert: NodeLoad
        expr: node_load15 &lt; 1
        <span class="token keyword">for</span>: 2m
        annotations:
          summary: <span class="token string">&quot;{{<span class="token variable">$labels</span>.instance}}: Low node load detected&quot;</span>
          description: <span class="token string">&quot;{{<span class="token variable">$labels</span>.instance}}: node load is below 1 (current value is: {{ <span class="token variable">$value</span> }}&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>告警规则的几个要素：</p><ul><li><code>group.name</code>：告警分组的名称，一个组下可以配置一类告警规则，比如都是物理节点相关的告警</li><li><code>alert</code>：告警规则的名称</li><li><code>expr</code>：是用于进行报警规则 PromQL 查询语句，expr通常是布尔表达式，可以让Prometheus根据计算的指标值做 true or false 的判断</li><li><code>for</code>：评估等待时间（Pending Duration），用于表示只有当触发条件持续一段时间后才发送告警，在等待期间新产生的告警状态为<code>pending</code>，屏蔽掉瞬时的问题，把焦点放在真正有持续影响的问题上</li><li><code>labels</code>：自定义标签，允许用户指定额外的标签列表，把它们附加在告警上，可以用于后面做路由判断，通知到不同的终端，通常被用于添加告警级别的标签</li><li><code>annotations</code>：指定了另一组标签，它们不被当做告警实例的身份标识，它们经常用于存储一些额外的信息，用于报警信息的展示之类的</li></ul><p>规则配置中，支持模板的方式，其中：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>- {{$labels}}可以获取当前指标的所有标签，支持{{$labels.instance}}或者{{$labels.job}}这种形式
- {{ $value }}可以获取当前计算出的指标值
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>更新配置并软重启，并查看Prometheus报警规则。</p><p>一个报警信息在生命周期内有下面3种状态：</p><ul><li><code>inactive</code>: 表示当前报警信息处于非活动状态，即不满足报警条件</li><li><code>pending</code>: 表示在设置的阈值时间范围内被激活了，即满足报警条件，但是还在观察期内</li><li><code>firing</code>: 表示超过设置的阈值时间被激活了，即满足报警条件，且报警触发时间超过了观察期，会发送到Alertmanager端</li></ul><p>对于已经 <code>pending</code> 或者 <code>firing</code> 的告警，Prometheus 也会将它们存储到时间序列<code>ALERTS{}</code>中。当然我们也可以通过表达式去查询告警实例：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>ALERTS<span class="token punctuation">{</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>查看Alertmanager日志：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>level=warn ts=2020-07-28T13:43:59<span class="token punctuation">.</span>430Z caller=notify<span class="token punctuation">.</span>go:674 component=dispatcher receiver=email integration=email<span class="token punctuation">[</span>0<span class="token punctuation">]</span> msg=<span class="token string">&quot;Notify attempt failed, will retry later&quot;</span> attempts=1 err=<span class="token string">&quot;*email.loginAuth auth: 550 User has no permission&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>说明告警已经推送到Alertmanager端了，但是邮箱登录的时候报错，这是因为邮箱默认没有开启第三方客户端登录。因此需要登录163邮箱设置SMTP服务允许客户端登录。</p><h6 id="自定义webhook实现告警消息的推送" tabindex="-1"><a class="header-anchor" href="#自定义webhook实现告警消息的推送" aria-hidden="true">#</a> 自定义webhook实现告警消息的推送</h6><p>目前官方内置的第三方通知集成包括：邮件、 即时通讯软件（如Slack、Hipchat）、移动应用消息推送(如Pushover)和自动化运维工具（例如：Pagerduty、Opsgenie、Victorops）。可以在alertmanager的管理界面中查看到。</p><p>每一个receiver具有一个全局唯一的名称，并且对应一个或者多个通知方式：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>name: &lt;string&gt;
email_configs:
  <span class="token punctuation">[</span> <span class="token operator">-</span> &lt;email_config&gt;<span class="token punctuation">,</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> <span class="token punctuation">]</span>
hipchat_configs:
  <span class="token punctuation">[</span> <span class="token operator">-</span> &lt;hipchat_config&gt;<span class="token punctuation">,</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> <span class="token punctuation">]</span>
slack_configs:
  <span class="token punctuation">[</span> <span class="token operator">-</span> &lt;slack_config&gt;<span class="token punctuation">,</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> <span class="token punctuation">]</span>
opsgenie_configs:
  <span class="token punctuation">[</span> <span class="token operator">-</span> &lt;opsgenie_config&gt;<span class="token punctuation">,</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> <span class="token punctuation">]</span>
webhook_configs:
  <span class="token punctuation">[</span> <span class="token operator">-</span> &lt;webhook_config&gt;<span class="token punctuation">,</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> <span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果想实现告警消息推送给企业常用的即时聊天工具，如钉钉或者企业微信，如何配置？</p><p>Alertmanager的通知方式中还可以支持Webhook，通过这种方式开发者可以实现更多个性化的扩展支持。</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token comment"># 警报接收者</span>
receivers:
<span class="token comment">#ops </span>
<span class="token operator">-</span> name: <span class="token string">&#39;demo-webhook&#39;</span>
  webhook_configs:
  <span class="token operator">-</span> send_resolved: true
    url: http:<span class="token operator">/</span><span class="token operator">/</span>demo-webhook/alert/send
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当我们配置了上述webhook地址，则当告警路由到<code>demo-webhook</code>时，alertmanager端会向webhook地址推送POST请求：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ curl <span class="token operator">-</span>X POST <span class="token operator">-</span>d<span class="token string">&quot;<span class="token variable">$demoAlerts</span>&quot;</span>  http:<span class="token operator">/</span><span class="token operator">/</span>demo-webhook/alert/send
$ <span class="token function">echo</span> <span class="token variable">$demoAlerts</span>
<span class="token punctuation">{</span>
  <span class="token string">&quot;version&quot;</span>: <span class="token string">&quot;4&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;groupKey&quot;</span>: &lt;string&gt;<span class="token punctuation">,</span> alerts <span class="token punctuation">(</span>e<span class="token punctuation">.</span>g<span class="token punctuation">.</span> to deduplicate<span class="token punctuation">)</span> <span class="token punctuation">,</span>
  <span class="token string">&quot;status&quot;</span>: <span class="token string">&quot;&lt;resolved|firing&gt;&quot;</span><span class="token punctuation">,</span> 
  <span class="token string">&quot;receiver&quot;</span>: &lt;string&gt;<span class="token punctuation">,</span> 
  <span class="token string">&quot;groupLabels&quot;</span>: &lt;object&gt;<span class="token punctuation">,</span> 
  <span class="token string">&quot;commonLabels&quot;</span>: &lt;object&gt;<span class="token punctuation">,</span> 
  <span class="token string">&quot;commonAnnotations&quot;</span>: &lt;object&gt;<span class="token punctuation">,</span> 
  <span class="token string">&quot;externalURL&quot;</span>: &lt;string&gt;<span class="token punctuation">,</span> <span class="token operator">/</span><span class="token operator">/</span> backlink to the Alertmanager<span class="token punctuation">.</span> 
  <span class="token string">&quot;alerts&quot;</span>: 
   <span class="token punctuation">[</span><span class="token punctuation">{</span> 
     <span class="token string">&quot;labels&quot;</span>: &lt;object&gt;<span class="token punctuation">,</span> 
      <span class="token string">&quot;annotations&quot;</span>: &lt;object&gt;<span class="token punctuation">,</span> 
      <span class="token string">&quot;startsAt&quot;</span>: <span class="token string">&quot;&lt;rfc3339&gt;&quot;</span><span class="token punctuation">,</span> 
      <span class="token string">&quot;endsAt&quot;</span>: <span class="token string">&quot;&lt;rfc3339&gt;&quot;</span> 
   <span class="token punctuation">}</span><span class="token punctuation">]</span> 
<span class="token punctuation">}</span> 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>因此，假如我们想把报警消息自动推送到钉钉群聊，只需要：</p><ul><li>实现一个webhook，部署到k8s集群 <ul><li>接收POST请求，将Alertmanager传过来的数据做解析，调用dingtalk的API，实现消息推送</li></ul></li><li>配置alertmanager的receiver为webhook地址</li></ul><p>如何给钉钉群聊发送消息？ 钉钉机器人</p><p>钉钉群聊机器人设置：</p><p>每个群聊机器人在创建的时候都会生成唯一的一个访问地址：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>https:<span class="token operator">/</span><span class="token operator">/</span>oapi<span class="token punctuation">.</span>dingtalk<span class="token punctuation">.</span>com/robot/send?access_token=e54f616718798e32d1e2ff1af5b095c37501878f816bdab2daf66d390633843a
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这样，我们就可以使用如下方式来模拟给群聊机器人发送请求，实现消息的推送：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>curl <span class="token string">&#39;https://oapi.dingtalk.com/robot/send?access_token=e54f616718798e32d1e2ff1af5b095c37501878f816bdab2daf66d390633843a&#39;</span> \\
   <span class="token operator">-</span>H <span class="token string">&#39;Content-Type: application/json&#39;</span> \\
   <span class="token operator">-</span>d <span class="token string">&#39;{&quot;msgtype&quot;: &quot;text&quot;,&quot;text&quot;: {&quot;content&quot;: &quot;我就是我, 是不一样的烟火&quot;}}&#39;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>https://gitee.com/agagin/prometheus-webhook-dingtalk</p><p>镜像地址：timonwong/prometheus-webhook-dingtalk:master</p><p>二进制运行：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ <span class="token punctuation">.</span><span class="token operator">/</span>prometheus-webhook-dingtalk <span class="token operator">--</span>config<span class="token punctuation">.</span>file=config<span class="token punctuation">.</span>yml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>假如使用如下配置：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>targets:
  webhook_dev:
    url: https:<span class="token operator">/</span><span class="token operator">/</span>oapi<span class="token punctuation">.</span>dingtalk<span class="token punctuation">.</span>com/robot/send?access_token=e54f616718798e32d1e2ff1af5b095c37501878f816bdab2daf66d390633843a
  webhook_ops:
    url: https:<span class="token operator">/</span><span class="token operator">/</span>oapi<span class="token punctuation">.</span>dingtalk<span class="token punctuation">.</span>com/robot/send?access_token=d4e7b72eab6d1b2245bc0869d674f627dc187577a3ad485d9c1d131b7d67b15b
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>则prometheus-webhook-dingtalk启动后会自动支持如下API的POST访问：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>http:<span class="token operator">/</span><span class="token operator">/</span>locahost:8060/dingtalk/webhook_dev/send
http:<span class="token operator">/</span><span class="token operator">/</span>localhost:8060/dingtalk/webhook_ops/send
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>这样可以使用一个prometheus-webhook-dingtalk来实现多个钉钉群的webhook地址</p><p>部署prometheus-webhook-dingtalk，从Dockerfile可以得知需要注意的点：</p><ul><li>默认使用配置文件<code>/etc/prometheus-webhook-dingtalk/config.yml</code>，可以通过configmap挂载</li><li>该目录下还有模板文件，因此需要使用subpath的方式挂载</li><li>部署Service，作为Alertmanager的默认访问，服务端口默认8060</li></ul><p>配置文件：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ <span class="token function">cat</span> webhook-dingtalk-configmap<span class="token punctuation">.</span>yaml
apiVersion: v1
<span class="token keyword">data</span>:
  config<span class="token punctuation">.</span>yml: <span class="token punctuation">|</span>
    targets:
      webhook_dev:
        url: https:<span class="token operator">/</span><span class="token operator">/</span>oapi<span class="token punctuation">.</span>dingtalk<span class="token punctuation">.</span>com/robot/send?access_token=e54f616718798e32d1e2ff1af5b095c37501878f816bdab2daf66d390633843a
kind: ConfigMap
metadata:
  name: webhook-dingtalk-config
  namespace: monitor
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Deployment和Service</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ <span class="token function">cat</span> webhook-dingtalk-deploy<span class="token punctuation">.</span>yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: webhook-dingtalk
  namespace: monitor
spec:
  selector:
    matchLabels:
      app: webhook-dingtalk
  template:
    metadata:
      labels:
        app: webhook-dingtalk
    spec:
      containers:
      <span class="token operator">-</span> name: webhook-dingtalk
        image: timonwong/prometheus-webhook-dingtalk:master
        imagePullPolicy: IfNotPresent
        volumeMounts:
        <span class="token operator">-</span> mountPath: <span class="token string">&quot;/etc/prometheus-webhook-dingtalk/config.yml&quot;</span>
          name: config
          subPath: config<span class="token punctuation">.</span>yml
        ports:
        <span class="token operator">-</span> containerPort: 8060
          name: http
        resources:
          requests:
            cpu: 50m
            memory: 100Mi
          limits:
            cpu: 50m
            memory: 100Mi
      volumes:
      <span class="token operator">-</span> name: config
        configMap:
          name: webhook-dingtalk-config
          items:
          <span class="token operator">-</span> key: config<span class="token punctuation">.</span>yml
            path: config<span class="token punctuation">.</span>yml
<span class="token operator">--</span><span class="token operator">-</span>
apiVersion: v1
kind: Service
metadata:
  name: webhook-dingtalk
  namespace: monitor
spec:
  selector:
    app: webhook-dingtalk
  ports:
  <span class="token operator">-</span> name: hook
    port: 8060
    targetPort: http
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>创建：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ kubectl create <span class="token operator">-</span>f webhook-dingtalk-configmap<span class="token punctuation">.</span>yaml
$ kubectl create <span class="token operator">-</span>f webhook-dingtalk-deploy<span class="token punctuation">.</span>yaml

<span class="token comment"># 查看日志，可以得知当前的可用webhook日志</span>
$ kubectl <span class="token operator">-</span>n monitor logs <span class="token operator">-</span>f webhook-dingtalk-f7f5589c9-qglkd
<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
file=<span class="token operator">/</span>etc/prometheus-webhook-dingtalk/config<span class="token punctuation">.</span>yml msg=<span class="token string">&quot;Completed loading of configuration file&quot;</span>
level=info ts=2020-07-30T14:05:40<span class="token punctuation">.</span>963Z caller=main<span class="token punctuation">.</span>go:117 component=configuration msg=<span class="token string">&quot;Loading templates&quot;</span> templates=
ts=2020-07-30T14:05:40<span class="token punctuation">.</span>963Z caller=main<span class="token punctuation">.</span>go:133 component=configuration msg=<span class="token string">&quot;Webhook urls for prometheus alertmanager&quot;</span> urls=<span class="token string">&quot;http://localhost:8060/dingtalk/webhook_dev/send http://localhost:8060/dingtalk/webhook_ops/send&quot;</span>
level=info ts=2020-07-30T14:05:40<span class="token punctuation">.</span>963Z caller=web<span class="token punctuation">.</span>go:210 component=web msg=<span class="token string">&quot;Start listening for connections&quot;</span> address=:8060
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>修改Alertmanager路由及webhook配置：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ <span class="token function">cat</span> alertmanager-configmap<span class="token punctuation">.</span>yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: alertmanager
  namespace: monitor
<span class="token keyword">data</span>:
  config<span class="token punctuation">.</span>yml: <span class="token punctuation">|</span><span class="token operator">-</span>
    global:
      <span class="token comment"># 当alertmanager持续多长时间未接收到告警后标记告警状态为 resolved</span>
      resolve_timeout: 5m
      <span class="token comment"># 配置邮件发送信息</span>
      smtp_smarthost: <span class="token string">&#39;smtp.163.com:25&#39;</span>
      smtp_from: <span class="token string">&#39;earlene163@163.com&#39;</span>
      smtp_auth_username: <span class="token string">&#39;earlene163@163.com&#39;</span>
      <span class="token comment"># 注意这里不是邮箱密码，是邮箱开启第三方客户端登录后的授权码</span>
      smtp_auth_password: <span class="token string">&#39;GXIWNXKMMEVMNHAJ&#39;</span>
      smtp_require_tls: false
    <span class="token comment"># 所有报警信息进入后的根路由，用来设置报警的分发策略</span>
    route:
      <span class="token comment"># 按照告警名称分组</span>
      group_by: <span class="token punctuation">[</span><span class="token string">&#39;alertname&#39;</span><span class="token punctuation">]</span>
      <span class="token comment"># 当一个新的报警分组被创建后，需要等待至少 group_wait 时间来初始化通知，这种方式可以确保您能有足够的时间为同一分组来获取多个警报，然后一起触发这个报警信息。</span>
      group_wait: 30s

      <span class="token comment"># 相同的group之间发送告警通知的时间间隔</span>
      group_interval: 30s

      <span class="token comment"># 如果一个报警信息已经发送成功了，等待 repeat_interval 时间来重新发送他们，不同类型告警发送频率需要具体配置</span>
      repeat_interval: 10m

      <span class="token comment"># 默认的receiver：如果一个报警没有被一个route匹配，则发送给默认的接收器</span>
      receiver: default

      <span class="token comment"># 路由树，默认继承global中的配置，并且可以在每个子路由上进行覆盖。</span>
      routes:
      <span class="token operator">-</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
    receivers:
    <span class="token operator">-</span> name: <span class="token string">&#39;default&#39;</span>
      email_configs:
      <span class="token operator">-</span> to: <span class="token string">&#39;654147123@qq.com&#39;</span>
        send_resolved: true  <span class="token comment"># 接受告警恢复的通知</span>
      webhook_configs:
      <span class="token operator">-</span> send_resolved: true
        url: http:<span class="token operator">/</span><span class="token operator">/</span>webhook-dingtalk:8060/dingtalk/webhook_dev/send
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>验证钉钉消息是否正常收到。</p><h6 id="基于label的动态告警处理" tabindex="-1"><a class="header-anchor" href="#基于label的动态告警处理" aria-hidden="true">#</a> 基于Label的动态告警处理</h6><p>真实的场景中，我们往往期望可以给告警设置级别，而且可以实现不同的报警级别可以由不同的receiver接收告警消息。</p><p>Alertmanager中路由负责对告警信息进行分组匹配，并向告警接收器发送通知。告警接收器可以通过以下形式进行配置：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>routes:
<span class="token operator">-</span> receiver: ops
  group_wait: 10s
  match:
    severity: critical
<span class="token operator">-</span> receiver: dev
  group_wait: 10s
  match_re:
    severity: normal<span class="token punctuation">|</span>middle
receivers:
  <span class="token operator">-</span> ops
    <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
  <span class="token operator">-</span> dev
    <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
  <span class="token operator">-</span> &lt;receiver&gt; <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>因此可以为了更全面的感受报警的逻辑，我们再添加两个报警规则：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>  alert_rules<span class="token punctuation">.</span>yml: <span class="token punctuation">|</span>
    groups:
    <span class="token operator">-</span> name: node_metrics
      rules:
      <span class="token operator">-</span> alert: NodeLoad
        expr: node_load15 &lt; 1
        <span class="token keyword">for</span>: 2m
        labels:
          severity: normal
        annotations:
          summary: <span class="token string">&quot;{{<span class="token variable">$labels</span>.instance}}: Low node load detected&quot;</span>
          description: <span class="token string">&quot;{{<span class="token variable">$labels</span>.instance}}: node load is below 1 (current value is: {{ <span class="token variable">$value</span> }}&quot;</span>
      <span class="token operator">-</span> alert: NodeMemoryUsage
        expr: <span class="token punctuation">(</span>node_memory_MemTotal_bytes <span class="token operator">-</span> <span class="token punctuation">(</span>node_memory_MemFree_bytes <span class="token operator">+</span> node_memory_Buffers_bytes <span class="token operator">+</span> node_memory_Cached_bytes<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">/</span> node_memory_MemTotal_bytes <span class="token operator">*</span> 100 &gt; 40
        <span class="token keyword">for</span>: 2m
        labels:
          severity: critical
        annotations:
          summary: <span class="token string">&quot;{{<span class="token variable">$labels</span>.instance}}: High Memory usage detected&quot;</span>
          description: <span class="token string">&quot;{{<span class="token variable">$labels</span>.instance}}: Memory usage is above 40% (current value is: {{ <span class="token variable">$value</span> }}&quot;</span>
    <span class="token operator">-</span> name: targets_status
      rules:
      <span class="token operator">-</span> alert: TargetStatus
        expr: up == 0
        <span class="token keyword">for</span>: 1m
        labels:
          severity: critical
        annotations:
          summary: <span class="token string">&quot;{{<span class="token variable">$labels</span>.instance}}: prometheus target down&quot;</span>
          description: <span class="token string">&quot;{{<span class="token variable">$labels</span>.instance}}: prometheus target down，job is {{<span class="token variable">$labels</span>.job}}&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们为不同的报警规则设置了不同的标签，如<code>severity: critical</code>，针对规则中的label，来配置alertmanager路由规则，实现转发给不同的接收者。</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ <span class="token function">cat</span> alertmanager-configmap<span class="token punctuation">.</span>yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: alertmanager
  namespace: monitor
<span class="token keyword">data</span>:
  config<span class="token punctuation">.</span>yml: <span class="token punctuation">|</span><span class="token operator">-</span>
    global:
      <span class="token comment"># 当alertmanager持续多长时间未接收到告警后标记告警状态为 resolved</span>
      resolve_timeout: 5m
      <span class="token comment"># 配置邮件发送信息</span>
      smtp_smarthost: <span class="token string">&#39;smtp.163.com:25&#39;</span>
      smtp_from: <span class="token string">&#39;earlene163@163.com&#39;</span>
      smtp_auth_username: <span class="token string">&#39;earlene163@163.com&#39;</span>
      <span class="token comment"># 注意这里不是邮箱密码，是邮箱开启第三方客户端登录后的授权码</span>
      smtp_auth_password: <span class="token string">&#39;RMAOPQVHKLPYFVHZ&#39;</span>
      smtp_require_tls: false
    <span class="token comment"># 所有报警信息进入后的根路由，用来设置报警的分发策略</span>
    route:
      <span class="token comment"># 按照告警名称分组</span>
      group_by: <span class="token punctuation">[</span><span class="token string">&#39;alertname&#39;</span><span class="token punctuation">]</span>
      <span class="token comment"># 当一个新的报警分组被创建后，需要等待至少 group_wait 时间来初始化通知，这种方式可以确保您能有足够的时间为同一分组来获取多个警报，然后一起触发这个报警信息。</span>
      group_wait: 30s

      <span class="token comment"># 相同的group之间发送告警通知的时间间隔</span>
      group_interval: 30s

      <span class="token comment"># 如果一个报警信息已经发送成功了，等待 repeat_interval 时间来重新发送他们，不同类型告警发送频率需要具体配置</span>
      repeat_interval: 1m

      <span class="token comment"># 默认的receiver：如果一个报警没有被一个route匹配，则发送给默认的接收器</span>
      receiver: default

      <span class="token comment"># 路由树，默认继承global中的配置，并且可以在每个子路由上进行覆盖。</span>
      routes:
      <span class="token operator">-</span> receiver: critical_alerts
        group_wait: 10s
        match:
          severity: critical
      <span class="token operator">-</span> receiver: normal_alerts
        group_wait: 10s
        match_re:
          severity: normal<span class="token punctuation">|</span>middle
    receivers:
    <span class="token operator">-</span> name: <span class="token string">&#39;default&#39;</span>
      email_configs:
      <span class="token operator">-</span> to: <span class="token string">&#39;654147123@qq.com&#39;</span>
        send_resolved: true  <span class="token comment"># 接受告警恢复的通知</span>
    <span class="token operator">-</span> name: <span class="token string">&#39;critical_alerts&#39;</span>
      webhook_configs:
      <span class="token operator">-</span> send_resolved: true
        url: http:<span class="token operator">/</span><span class="token operator">/</span>webhook-dingtalk:8060/dingtalk/webhook_ops/send
    <span class="token operator">-</span> name: <span class="token string">&#39;normal_alerts&#39;</span>
      webhook_configs:
      <span class="token operator">-</span> send_resolved: true
        url: http:<span class="token operator">/</span><span class="token operator">/</span>webhook-dingtalk:8060/dingtalk/webhook_dev/send
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>再配置一个钉钉机器人，修改webhook-dingtalk的配置，添加webhook_ops的配置：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ <span class="token function">cat</span> webhook-dingtalk-configmap<span class="token punctuation">.</span>yaml
apiVersion: v1
<span class="token keyword">data</span>:
  config<span class="token punctuation">.</span>yml: <span class="token punctuation">|</span>
    targets:
      webhook_dev:
        url: https:<span class="token operator">/</span><span class="token operator">/</span>oapi<span class="token punctuation">.</span>dingtalk<span class="token punctuation">.</span>com/robot/send?access_token=e54f616718798e32d1e2ff1af5b095c37501878f816bdab2daf66d390633843a
      webhook_ops:
        url: https:<span class="token operator">/</span><span class="token operator">/</span>oapi<span class="token punctuation">.</span>dingtalk<span class="token punctuation">.</span>com/robot/send?access_token=5a68888fbecde75b1832ff024d7374e51f2babd33f1078e5311cdbb8e2c00c3a
kind: ConfigMap
metadata:
  name: webhook-dingtalk-config
  namespace: monitor
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>设置webhook-dingtalk开启lifecycle</p><p>分别更新Prometheus和Alertmanager配置，查看报警的发送。</p><h6 id="抑制和静默" tabindex="-1"><a class="header-anchor" href="#抑制和静默" aria-hidden="true">#</a> 抑制和静默</h6><p>前面我们知道，告警的<code>group(分组)</code>功能通过把多条告警数据聚合，有效的减少告警的频繁发送。除此之外，Alertmanager还支持<code>Inhibition(抑制)</code> 和 <code>Silences(静默)</code>，帮助我们抑制或者屏蔽报警。</p><ul><li><p>Inhibition 抑制</p><p>抑制是当出现其它告警的时候压制当前告警的通知，可以有效的防止告警风暴。</p><p>比如当机房出现网络故障时，所有服务都将不可用而产生大量服务不可用告警，但这些警告并不能反映真实问题在哪，真正需要发出的应该是网络故障告警。当出现网络故障告警的时候，应当抑制服务不可用告警的通知。</p><p>在Alertmanager配置文件中，使用inhibit_rules定义一组告警的抑制规则：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>inhibit_rules:
  <span class="token punctuation">[</span> <span class="token operator">-</span> &lt;inhibit_rule&gt; <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> <span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>每一条抑制规则的具体配置如下：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>target_match:
  <span class="token punctuation">[</span> &lt;labelname&gt;: &lt;labelvalue&gt;<span class="token punctuation">,</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> <span class="token punctuation">]</span>
target_match_re:
  <span class="token punctuation">[</span> &lt;labelname&gt;: &lt;regex&gt;<span class="token punctuation">,</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> <span class="token punctuation">]</span>

source_match:
  <span class="token punctuation">[</span> &lt;labelname&gt;: &lt;labelvalue&gt;<span class="token punctuation">,</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> <span class="token punctuation">]</span>
source_match_re:
  <span class="token punctuation">[</span> &lt;labelname&gt;: &lt;regex&gt;<span class="token punctuation">,</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> <span class="token punctuation">]</span>

<span class="token punctuation">[</span> equal: <span class="token string">&#39;[&#39;</span> &lt;labelname&gt;<span class="token punctuation">,</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> <span class="token string">&#39;]&#39;</span> <span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当已经发送的告警通知匹配到target_match或者target_match_re规则，当有新的告警规则如果满足source_match或者定义的匹配规则，并且已发送的告警与新产生的告警中equal定义的标签完全相同，则启动抑制机制，新的告警不会发送。</p><p>例如，定义如下抑制规则：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token operator">-</span> source_match:
    alertname: NodeDown
    severity: critical
  target_match:
    severity: critical
  equal:
    <span class="token operator">-</span> node
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如当集群中的某一个主机节点异常宕机导致告警NodeDown被触发，同时在告警规则中定义了告警级别severity=critical。由于主机异常宕机，该主机上部署的所有服务，中间件会不可用并触发报警。根据抑制规则的定义，如果有新的告警级别为severity=critical，并且告警中标签node的值与NodeDown告警的相同，则说明新的告警是由NodeDown导致的，则启动抑制机制停止向接收器发送通知。</p><p>演示：实现如果 NodeMemoryUsage 报警触发，则抑制NodeLoad指标规则引起的报警。</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>    inhibit_rules:
    <span class="token operator">-</span> source_match:
        alertname: NodeMemoryUsage
        severity: critical
      target_match:
        severity: normal
      equal:
        <span class="token operator">-</span> instance
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>Silences： 静默</p><p>简单直接的在指定时段关闭告警。静默通过匹配器（Matcher）来配置，类似于路由树。警告进入系统的时候会检查它是否匹配某条静默规则，如果是则该警告的通知将忽略。 静默规则在Alertmanager的 Web 界面里配置。</p></li></ul><p>一条告警产生后，还要经过 Alertmanager 的分组、抑制处理、静默处理、去重处理和降噪处理最后再发送给接收者。这个过程中可能会因为各种原因会导致告警产生了却最终没有进行通知，可以通过下图了解整个告警的生命周期：</p><p><img src="`+A+'" alt=""></p><p>https://github.com/liyongxin/prometheus-webhook-wechat</p><h5 id="自定义指标实现业务伸缩" tabindex="-1"><a class="header-anchor" href="#自定义指标实现业务伸缩" aria-hidden="true">#</a> 自定义指标实现业务伸缩</h5><h6 id="kubernetes-metrics-api体系回顾" tabindex="-1"><a class="header-anchor" href="#kubernetes-metrics-api体系回顾" aria-hidden="true">#</a> Kubernetes Metrics API体系回顾</h6><p>前面章节，我们讲过基于CPU和内存的HPA，即利用metrics-server及HPA，可以实现业务服务可以根据pod的cpu和内存进行弹性伸缩。</p><p><img src="'+l+`" alt=""></p><p>k8s对监控接口进行了标准化：</p><ul><li><p>Resource Metrics</p><p>对应的接口是 metrics.k8s.io，主要的实现就是 metrics-server</p></li><li><p>Custom Metrics</p><p>对应的接口是 custom.metrics.k8s.io，主要的实现是 Prometheus， 它提供的是资源监控和自定义监控</p></li></ul><p>安装完metrics-server后，利用kube-aggregator的功能，实现了metrics api的注册。可以通过如下命令</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ kubectl api-versions
<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
metrics<span class="token punctuation">.</span>k8s<span class="token punctuation">.</span>io/v1beta1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>HPA通过使用该API获取监控的CPU和内存资源：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token comment"># 查询nodes节点的cpu和内存数据</span>
$ kubectl get <span class="token operator">--</span>raw=<span class="token string">&quot;/apis/metrics.k8s.io/v1beta1/nodes&quot;</span><span class="token punctuation">|</span>jq

$ kubectl get <span class="token operator">--</span>raw=<span class="token string">&quot;/apis/metrics.k8s.io/v1beta1/pods&quot;</span><span class="token punctuation">|</span>jq

<span class="token comment"># 若本机没有安装jq命令，可以参考如下方式进行安装</span>
$ wget http:<span class="token operator">/</span><span class="token operator">/</span>dl<span class="token punctuation">.</span>fedoraproject<span class="token punctuation">.</span>org/pub/epel/epel-release-latest-7<span class="token punctuation">.</span>noarch<span class="token punctuation">.</span>rpm
$ rpm <span class="token operator">-</span>ivh epel-release-latest-7<span class="token punctuation">.</span>noarch<span class="token punctuation">.</span>rpm
$ yum install <span class="token operator">-</span>y jq
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>同样，为了实现通用指标的采集，需要部署Prometheus Adapter，来提供<code>custom.metrics.k8s.io</code>，作为HPA获取通用指标的入口。</p><h6 id="adapter安装对接" tabindex="-1"><a class="header-anchor" href="#adapter安装对接" aria-hidden="true">#</a> Adapter安装对接</h6><p>项目地址为： https://github.com/DirectXMan12/k8s-prometheus-adapter</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ git clone https:<span class="token operator">/</span><span class="token operator">/</span>github<span class="token punctuation">.</span>com/DirectXMan12/k8s-prometheus-adapter<span class="token punctuation">.</span>git

<span class="token comment"># 最新release版本v0.7.0，代码切换到v0.7.0分支</span>
$ git checkout v0<span class="token punctuation">.</span>7<span class="token punctuation">.</span>0

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>查看部署说明 https://github.com/DirectXMan12/k8s-prometheus-adapter/tree/v0.7.0/deploy</p><ol><li><p>镜像使用官方提供的v0.7.0最新版 https://hub.docker.com/r/directxman12/k8s-prometheus-adapter/tags</p></li><li><p>准备证书</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ export PURPOSE=serving
$ openssl req <span class="token operator">-</span>x509 <span class="token operator">-</span>sha256 <span class="token operator">-</span>new <span class="token operator">-</span>nodes <span class="token operator">-</span>days 365 <span class="token operator">-</span>newkey rsa:2048 <span class="token operator">-</span>keyout $<span class="token punctuation">{</span>PURPOSE<span class="token punctuation">}</span><span class="token punctuation">.</span>key <span class="token operator">-</span>out $<span class="token punctuation">{</span>PURPOSE<span class="token punctuation">}</span><span class="token punctuation">.</span>crt <span class="token operator">-</span>subj <span class="token string">&quot;/CN=ca&quot;</span>

$ kubectl <span class="token operator">-</span>n monitor create secret generic cm-adapter-serving-certs <span class="token operator">--</span><span class="token keyword">from</span><span class="token operator">-</span>file=<span class="token punctuation">.</span><span class="token operator">/</span>serving<span class="token punctuation">.</span>crt <span class="token operator">--</span><span class="token keyword">from</span><span class="token operator">-</span>file=<span class="token punctuation">.</span><span class="token operator">/</span>serving<span class="token punctuation">.</span>key 

<span class="token comment"># 查看证书</span>
$ kubectl <span class="token operator">-</span>n monitor describe secret cm-adapter-serving-certs
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>准备资源清单</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ mkdir yamls
$ <span class="token function">cp</span> manifests/custom-metrics-apiserver-deployment<span class="token punctuation">.</span>yaml yamls/
$ <span class="token function">cp</span> manifests/custom-metrics-apiserver-service<span class="token punctuation">.</span>yaml yamls/
$ <span class="token function">cp</span> manifests/custom-metrics-apiservice<span class="token punctuation">.</span>yaml yamls/

$ cd yamls
<span class="token comment"># 新建rbac文件</span>
$ vi custom-metrics-apiserver-rbac<span class="token punctuation">.</span>yaml
kind: ServiceAccount
apiVersion: v1
metadata:
  name: custom-metrics-apiserver
  namespace: monitor
<span class="token operator">--</span><span class="token operator">-</span>
apiVersion: rbac<span class="token punctuation">.</span>authorization<span class="token punctuation">.</span>k8s<span class="token punctuation">.</span>io/v1
kind: ClusterRoleBinding
metadata:
  name: custom-metrics-resource-cluster-admin
roleRef:
  apiGroup: rbac<span class="token punctuation">.</span>authorization<span class="token punctuation">.</span>k8s<span class="token punctuation">.</span>io
  kind: ClusterRole
  name: cluster-admin
subjects:
<span class="token operator">-</span> kind: ServiceAccount
  name: custom-metrics-apiserver
  namespace: monitor
  
<span class="token comment"># 新建配置文件</span>
$ vi custom-metrics-configmap<span class="token punctuation">.</span>yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: adapter-config
  namespace: monitor
<span class="token keyword">data</span>:
  config<span class="token punctuation">.</span>yaml: <span class="token punctuation">|</span>
    rules:
    <span class="token operator">-</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>替换命名空间</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token comment"># 资源清单文件默认用的命名空间是custom-metrics，替换为本例中使用的monitor</span>
$ sed <span class="token operator">-</span>i <span class="token string">&#39;s/namespace: custom-metrics/namespace: monitor/g&#39;</span> yamls/<span class="token operator">*</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>配置adapter对接的Prometheus地址</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token comment"># 由于adapter会和Prometheus交互，因此需要配置对接的Prometheus地址</span>
<span class="token comment"># 替换掉28行：yamls/custom-metrics-apiserver-deployment.yaml 中的--prometheus-url</span>
$ vim yamls/custom-metrics-apiserver-deployment<span class="token punctuation">.</span>yaml
<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
     18     spec:
     19       serviceAccountName: custom-metrics-apiserver
     20       containers:
     21       <span class="token operator">-</span> name: custom-metrics-apiserver
     22         image: directxman12/k8s-prometheus-adapter-amd64:v0<span class="token punctuation">.</span>7<span class="token punctuation">.</span>0
     23         args:
     24         <span class="token operator">-</span> <span class="token operator">--</span>secure-port=6443
     25         <span class="token operator">-</span> <span class="token operator">--</span>tls-cert-file=<span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>run/serving-cert/serving<span class="token punctuation">.</span>crt
     26         <span class="token operator">-</span> <span class="token operator">--</span>tls-private-key-file=<span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>run/serving-cert/serving<span class="token punctuation">.</span>key
     27         <span class="token operator">-</span> <span class="token operator">--</span>logtostderr=true
     28         <span class="token operator">-</span> <span class="token operator">--</span>prometheus-url=http:<span class="token operator">/</span><span class="token operator">/</span>prometheus:9090/
     29         <span class="token operator">-</span> <span class="token operator">--</span>metrics-relist-interval=1m
     30         <span class="token operator">-</span> <span class="token operator">--</span>v=10
     31         <span class="token operator">-</span> <span class="token operator">--</span>config=<span class="token operator">/</span>etc/adapter/config<span class="token punctuation">.</span>yaml
<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>部署服务</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ kubectl create <span class="token operator">-</span>f yamls/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li></ol><p>验证一下：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ kubectl api-versions 
custom<span class="token punctuation">.</span>metrics<span class="token punctuation">.</span>k8s<span class="token punctuation">.</span>io/v1beta1

$ kubectl get <span class="token operator">--</span>raw <span class="token operator">/</span>apis/custom<span class="token punctuation">.</span>metrics<span class="token punctuation">.</span>k8s<span class="token punctuation">.</span>io/v1beta1 <span class="token punctuation">|</span>jq
<span class="token punctuation">{</span>                                                    
  <span class="token string">&quot;kind&quot;</span>: <span class="token string">&quot;APIResourceList&quot;</span><span class="token punctuation">,</span>                         
  <span class="token string">&quot;apiVersion&quot;</span>: <span class="token string">&quot;v1&quot;</span><span class="token punctuation">,</span>                                
  <span class="token string">&quot;groupVersion&quot;</span>: <span class="token string">&quot;custom.metrics.k8s.io/v1beta1&quot;</span><span class="token punctuation">,</span>   
  <span class="token string">&quot;resources&quot;</span>: <span class="token punctuation">[</span><span class="token punctuation">]</span>                                    
<span class="token punctuation">}</span>                                                    
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="通用指标示例程序部署" tabindex="-1"><a class="header-anchor" href="#通用指标示例程序部署" aria-hidden="true">#</a> 通用指标示例程序部署</h6><p><img src="`+l+`" alt=""></p><p>为了演示效果，我们新建一个deployment来模拟业务应用。</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ <span class="token function">cat</span> custom-metrics-demo<span class="token punctuation">.</span>yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: custom-metrics-demo
spec:
  selector:
    matchLabels:
      app: custom-metrics-demo
  template:
    metadata:
      labels:
        app: custom-metrics-demo
    spec:
      containers:
      <span class="token operator">-</span> name: custom-metrics-demo
        image: cnych/nginx-vts:v1<span class="token punctuation">.</span>0
        resources:
          limits:
            cpu: 50m
          requests:
            cpu: 50m
        ports:
        <span class="token operator">-</span> containerPort: 80
          name: http
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>部署：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ kubectl create <span class="token operator">-</span>f custom-metrics-demo<span class="token punctuation">.</span>yaml

$ kubectl get po <span class="token operator">-</span>o wide
custom-metrics-demo-95b5bc949-xpppl   1/1     Running   0          65s   10<span class="token punctuation">.</span>224<span class="token punctuation">.</span>2<span class="token punctuation">.</span>115

$ curl 10<span class="token punctuation">.</span>224<span class="token punctuation">.</span>2<span class="token punctuation">.</span>115/status/format/prometheus
<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
nginx_vts_server_requests_total<span class="token punctuation">{</span>host=<span class="token string">&quot;*&quot;</span><span class="token punctuation">,</span>code=<span class="token string">&quot;1xx&quot;</span><span class="token punctuation">}</span> 0
nginx_vts_server_requests_total<span class="token punctuation">{</span>host=<span class="token string">&quot;*&quot;</span><span class="token punctuation">,</span>code=<span class="token string">&quot;2xx&quot;</span><span class="token punctuation">}</span> 8
nginx_vts_server_requests_total<span class="token punctuation">{</span>host=<span class="token string">&quot;*&quot;</span><span class="token punctuation">,</span>code=<span class="token string">&quot;3xx&quot;</span><span class="token punctuation">}</span> 0
nginx_vts_server_requests_total<span class="token punctuation">{</span>host=<span class="token string">&quot;*&quot;</span><span class="token punctuation">,</span>code=<span class="token string">&quot;4xx&quot;</span><span class="token punctuation">}</span> 0
nginx_vts_server_requests_total<span class="token punctuation">{</span>host=<span class="token string">&quot;*&quot;</span><span class="token punctuation">,</span>code=<span class="token string">&quot;5xx&quot;</span><span class="token punctuation">}</span> 0
nginx_vts_server_requests_total<span class="token punctuation">{</span>host=<span class="token string">&quot;*&quot;</span><span class="token punctuation">,</span>code=<span class="token string">&quot;total&quot;</span><span class="token punctuation">}</span> 8
<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注册为Prometheus的target：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ <span class="token function">cat</span> custom-metrics-demo-svc<span class="token punctuation">.</span>yaml
apiVersion: v1
kind: Service
metadata:
  name: custom-metrics-demo
  annotations:
    prometheus<span class="token punctuation">.</span>io/scrape: <span class="token string">&quot;true&quot;</span>
    prometheus<span class="token punctuation">.</span>io/port: <span class="token string">&quot;80&quot;</span>
    prometheus<span class="token punctuation">.</span>io/path: <span class="token string">&quot;/status/format/prometheus&quot;</span>
spec:
  ports:
  <span class="token operator">-</span> port: 80
    targetPort: 80
    name: http
  selector:
    app: custom-metrics-demo
  <span class="token function">type</span>: ClusterIP
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>自动注册为Prometheus的采集Targets。</p><p>通常web类的应用，会把每秒钟的请求数作为业务伸缩的指标依据。</p><p>实践：</p><p>使用案例应用<code>custom-metrics-demo</code>，如果<code>custom-metrics-demo</code>最近2分钟内每秒钟的请求数超过10次，则自动扩充业务应用的副本数。</p><ul><li><p>配置自定义指标</p><p>告诉Adapter去采集转换哪些指标，Adapter支持转换的指标，才可以作为HPA的依据</p></li><li><p>配置HPA规则</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>apiVersion: autoscaling/v2beta1
kind: HorizontalPodAutoscaler
metadata:
  name: nginx-custom-hpa
  namespace: default
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: custom-metrics-demo
  minReplicas: 1
  maxReplicas: 3
  metrics:
  <span class="token operator">-</span> <span class="token function">type</span>: Pods
    pods:
      metricName: nginx_vts_server_requests_per_second
      targetAverageValue: 10
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h6 id="adapter配置自定义指标" tabindex="-1"><a class="header-anchor" href="#adapter配置自定义指标" aria-hidden="true">#</a> Adapter配置自定义指标</h6><p><img src="`+C+`" alt=""></p><p>思考：</p><p>前面讲CPU的平均使用率的采集，其实是通过<code>node_cpu_seconds_total</code>指标计算得到的。</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>  ^
  │   <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span>   <span class="token punctuation">.</span> <span class="token punctuation">.</span>   node_cpu<span class="token punctuation">{</span>cpu=<span class="token string">&quot;cpu0&quot;</span><span class="token punctuation">,</span>mode=<span class="token string">&quot;idle&quot;</span><span class="token punctuation">}</span>
  │     <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span>   node_cpu<span class="token punctuation">{</span>cpu=<span class="token string">&quot;cpu0&quot;</span><span class="token punctuation">,</span>mode=<span class="token string">&quot;system&quot;</span><span class="token punctuation">}</span>
  │     <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span>   <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span>   node_load1<span class="token punctuation">{</span><span class="token punctuation">}</span>
  │     <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span>   <span class="token punctuation">.</span> <span class="token punctuation">.</span>   node_cpu_seconds_total<span class="token punctuation">{</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">}</span>
  v
    &lt;<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span> 时间 <span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span>&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>同样，如果想获得每个业务应用最近2分钟内每秒的访问次数，也是根据总数来做计算，因此，需要使用业务自定义指标<code>nginx_vts_server_requests_total</code>，配合<code>rate</code>方法即可获取每秒钟的请求数。</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>rate<span class="token punctuation">(</span>nginx_vts_server_requests_total<span class="token punctuation">[</span>2m<span class="token punctuation">]</span><span class="token punctuation">)</span>

<span class="token comment"># 如查询有多条数据，需做汇聚，需要使用sum</span>
sum<span class="token punctuation">(</span>rate<span class="token punctuation">(</span>nginx_vts_server_requests_total<span class="token punctuation">[</span>2m<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span> by<span class="token punctuation">(</span>kubernetes_pod_name<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol><li><p>自定义指标可以配置多个，因此，需要将规则使用数组来配置</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>rules:
<span class="token operator">-</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>告诉Adapter，哪些自定义指标可以使用</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>rules:
<span class="token operator">-</span> seriesQuery: <span class="token string">&#39;nginx_vts_server_requests_total{host=&quot;*&quot;,code=&quot;total&quot;}&#39;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>seriesQuery是PromQL语句，和直接用<code>nginx_vts_server_requests_total</code>查询到的结果一样，凡是seriesQuery可以查询到的指标，都可以用作自定义指标</p></li><li><p>告诉Adapter，指标中的标签和k8s中的资源对象的关联关系</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>rules:
<span class="token operator">-</span> seriesQuery: <span class="token string">&#39;nginx_vts_server_requests_total{host=&quot;*&quot;,code=&quot;total&quot;}&#39;</span>
  resources:
    overrides:
      kubernetes_namespace: <span class="token punctuation">{</span>resource: <span class="token string">&quot;namespace&quot;</span><span class="token punctuation">}</span>
      kubernetes_pod_name: <span class="token punctuation">{</span>resource: <span class="token string">&quot;pod&quot;</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们查询到的可用指标格式为：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>nginx_vts_server_requests_total<span class="token punctuation">{</span>code=<span class="token string">&quot;1xx&quot;</span><span class="token punctuation">,</span>host=<span class="token string">&quot;*&quot;</span><span class="token punctuation">,</span>instance=<span class="token string">&quot;10.244.1.194:80&quot;</span><span class="token punctuation">,</span>job=<span class="token string">&quot;kubernetes-sd-endpoints&quot;</span><span class="token punctuation">,</span>kubernetes_name=<span class="token string">&quot;custom-metrics-demo&quot;</span><span class="token punctuation">,</span>kubernetes_namespace=<span class="token string">&quot;default&quot;</span><span class="token punctuation">,</span>kubernetes_pod_name=<span class="token string">&quot;custom-metrics-demo-95b5bc949-xpppl&quot;</span><span class="token punctuation">}</span>	
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>由于HPA在调用Adapter接口的时候，告诉Adapter的是查询哪个命名空间下的哪个Pod的指标，因此，Adapter在去查询的时候，需要做一层适配转换（因为并不是每个prometheus查询到的结果中都是叫做<code>kubernetes_namespace</code>和<code>kubernetes_pod_name</code>）</p></li><li><p>指定自定义的指标名称，供HPA配置使用</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>rules:
<span class="token operator">-</span> seriesQuery: <span class="token string">&#39;nginx_vts_server_requests_total{host=&quot;*&quot;,code=&quot;total&quot;}&#39;</span>
  resources:
    overrides:
      kubernetes_namespace: <span class="token punctuation">{</span>resource: <span class="token string">&quot;namespace&quot;</span><span class="token punctuation">}</span>
      kubernetes_pod_name: <span class="token punctuation">{</span>resource: <span class="token string">&quot;pods&quot;</span><span class="token punctuation">}</span>
  name:
    matches: <span class="token string">&quot;^(.*)_total&quot;</span>
    as: <span class="token string">&quot;\${1}_per_second&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>因为Adapter转换完之后的指标含义为：每秒钟的请求数。因此提供指标名称，该配置根据正则表达式做了匹配替换，转换完后的指标名称为：<code>nginx_vts_server_requests_per_second</code>，HPA规则中可以直接配置该名称。</p></li><li><p>告诉Adapter如何获取最终的自定义指标值</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>rules:
<span class="token operator">-</span> seriesQuery: <span class="token string">&#39;nginx_vts_server_requests_total{host=&quot;*&quot;,code=&quot;total&quot;}&#39;</span>
  resources:
    overrides:
      kubernetes_namespace: <span class="token punctuation">{</span>resource: <span class="token string">&quot;namespace&quot;</span><span class="token punctuation">}</span>
      kubernetes_pod_name: <span class="token punctuation">{</span>resource: <span class="token string">&quot;pod&quot;</span><span class="token punctuation">}</span>
  name:
    matches: <span class="token string">&quot;^(.*)_total&quot;</span>
    as: <span class="token string">&quot;\${1}_per_second&quot;</span>
  metricsQuery: <span class="token string">&#39;sum(rate(&lt;&lt;.Series&gt;&gt;{&lt;&lt;.LabelMatchers&gt;&gt;}[2m])) by (&lt;&lt;.GroupBy&gt;&gt;)&#39;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们最终期望的写法可能是这样：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>sum<span class="token punctuation">(</span>rate<span class="token punctuation">(</span>nginx_vts_server_requests_total<span class="token punctuation">{</span>host=<span class="token string">&quot;*&quot;</span><span class="token punctuation">,</span>code=<span class="token string">&quot;total&quot;</span><span class="token punctuation">,</span>kubernetes_namespace=<span class="token string">&quot;default&quot;</span><span class="token punctuation">}</span><span class="token punctuation">[</span>2m<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span> by <span class="token punctuation">(</span>kubernetes_pod_name<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>但是Adapter提供了更简单的写法：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>sum<span class="token punctuation">(</span>rate<span class="token punctuation">(</span>&lt;&lt;<span class="token punctuation">.</span>Series&gt;&gt;<span class="token punctuation">{</span>&lt;&lt;<span class="token punctuation">.</span>LabelMatchers&gt;&gt;<span class="token punctuation">}</span><span class="token punctuation">[</span>2m<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span> by <span class="token punctuation">(</span>&lt;&lt;<span class="token punctuation">.</span>GroupBy&gt;&gt;<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li><code>Series</code>: 指标名称</li><li><code>LabelMatchers</code>: 指标查询的label</li><li><code>GroupBy</code>: 结果分组，针对HPA过来的查询，都会匹配成<code>kubernetes_pod_name</code></li></ul></li></ol><p>更新Adapter的配置：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ vi custom-metrics-configmap<span class="token punctuation">.</span>yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: adapter-config
  namespace: monitor
<span class="token keyword">data</span>:
  config<span class="token punctuation">.</span>yaml: <span class="token punctuation">|</span>
    rules:
    <span class="token operator">-</span> seriesQuery: <span class="token string">&#39;nginx_vts_server_requests_total{host=&quot;*&quot;,code=&quot;total&quot;}&#39;</span>
      seriesFilters: <span class="token punctuation">[</span><span class="token punctuation">]</span>
      resources:
        overrides:
          kubernetes_namespace: <span class="token punctuation">{</span>resource: <span class="token string">&quot;namespace&quot;</span><span class="token punctuation">}</span>
          kubernetes_pod_name: <span class="token punctuation">{</span>resource: <span class="token string">&quot;pod&quot;</span><span class="token punctuation">}</span>
      name:
        matches: <span class="token string">&quot;^(.*)_total&quot;</span>
        as: <span class="token string">&quot;\${1}_per_second&quot;</span>
      metricsQuery: <span class="token punctuation">(</span>sum<span class="token punctuation">(</span>rate<span class="token punctuation">(</span>&lt;&lt;<span class="token punctuation">.</span>Series&gt;&gt;<span class="token punctuation">{</span>&lt;&lt;<span class="token punctuation">.</span>LabelMatchers&gt;&gt;<span class="token punctuation">}</span><span class="token punctuation">[</span>1m<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span> by <span class="token punctuation">(</span>&lt;&lt;<span class="token punctuation">.</span>GroupBy&gt;&gt;<span class="token punctuation">)</span><span class="token punctuation">)</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>需要更新configmap并重启adapter服务：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ kubectl apply <span class="token operator">-</span>f custom-metrics-configmap<span class="token punctuation">.</span>yaml

$ kubectl <span class="token operator">-</span>n monitor delete po custom-metrics-apiserver-c689ff947-zp8gq
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>再次查看可用的指标数据：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ kubectl get <span class="token operator">--</span>raw <span class="token operator">/</span>apis/custom<span class="token punctuation">.</span>metrics<span class="token punctuation">.</span>k8s<span class="token punctuation">.</span>io/v1beta1 <span class="token punctuation">|</span>jq
<span class="token punctuation">{</span>
  <span class="token string">&quot;kind&quot;</span>: <span class="token string">&quot;APIResourceList&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;apiVersion&quot;</span>: <span class="token string">&quot;v1&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;groupVersion&quot;</span>: <span class="token string">&quot;custom.metrics.k8s.io/v1beta1&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;resources&quot;</span>: <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token string">&quot;name&quot;</span>: <span class="token string">&quot;namespaces/nginx_vts_server_requests_per_second&quot;</span><span class="token punctuation">,</span>
      <span class="token string">&quot;singularName&quot;</span>: <span class="token string">&quot;&quot;</span><span class="token punctuation">,</span>
      <span class="token string">&quot;namespaced&quot;</span>: false<span class="token punctuation">,</span>
      <span class="token string">&quot;kind&quot;</span>: <span class="token string">&quot;MetricValueList&quot;</span><span class="token punctuation">,</span>
      <span class="token string">&quot;verbs&quot;</span>: <span class="token punctuation">[</span>
        <span class="token string">&quot;get&quot;</span>
      <span class="token punctuation">]</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span>
      <span class="token string">&quot;name&quot;</span>: <span class="token string">&quot;pods/nginx_vts_server_requests_per_second&quot;</span><span class="token punctuation">,</span>
      <span class="token string">&quot;singularName&quot;</span>: <span class="token string">&quot;&quot;</span><span class="token punctuation">,</span>
      <span class="token string">&quot;namespaced&quot;</span>: true<span class="token punctuation">,</span>
      <span class="token string">&quot;kind&quot;</span>: <span class="token string">&quot;MetricValueList&quot;</span><span class="token punctuation">,</span>
      <span class="token string">&quot;verbs&quot;</span>: <span class="token punctuation">[</span>
        <span class="token string">&quot;get&quot;</span>
      <span class="token punctuation">]</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们发现有两个可用的resources，引用官方的一段解释：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>Notice that we get an entry <span class="token keyword">for</span> both <span class="token string">&quot;pods&quot;</span> and <span class="token string">&quot;namespaces&quot;</span> <span class="token operator">--</span> the adapter exposes the metric on each resource that we&#39;ve associated the metric with <span class="token punctuation">(</span>and all namespaced resources must be associated with a namespace<span class="token punctuation">)</span><span class="token punctuation">,</span> and will fill in the &lt;&lt;<span class="token punctuation">.</span>GroupBy&gt;&gt; section with the appropriate label depending on which we ask <span class="token keyword">for</span><span class="token punctuation">.</span>

We can now connect to <span class="token variable">$KUBERNETES</span><span class="token operator">/</span>apis/custom<span class="token punctuation">.</span>metrics<span class="token punctuation">.</span>k8s<span class="token punctuation">.</span>io/v1beta1/namespaces/default/pods/<span class="token operator">*</span><span class="token operator">/</span>nginx_vts_server_requests_per_second<span class="token punctuation">,</span> and we should see
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ kubectl get <span class="token operator">--</span>raw <span class="token string">&quot;/apis/custom.metrics.k8s.io/v1beta1/namespaces/default/pods/*/nginx_vts_server_requests_per_second&quot;</span> <span class="token punctuation">|</span> jq 
<span class="token punctuation">{</span>
  <span class="token string">&quot;kind&quot;</span>: <span class="token string">&quot;MetricValueList&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;apiVersion&quot;</span>: <span class="token string">&quot;custom.metrics.k8s.io/v1beta1&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;metadata&quot;</span>: <span class="token punctuation">{</span>
    <span class="token string">&quot;selfLink&quot;</span>: <span class="token string">&quot;/apis/custom.metrics.k8s.io/v1beta1/namespaces/default/pods/%2A/nginx_vts_server_requests_per_second&quot;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token string">&quot;items&quot;</span>: <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token string">&quot;describedObject&quot;</span>: <span class="token punctuation">{</span>
        <span class="token string">&quot;kind&quot;</span>: <span class="token string">&quot;Pod&quot;</span><span class="token punctuation">,</span>
        <span class="token string">&quot;namespace&quot;</span>: <span class="token string">&quot;default&quot;</span><span class="token punctuation">,</span>
        <span class="token string">&quot;name&quot;</span>: <span class="token string">&quot;custom-metrics-demo-95b5bc949-xpppl&quot;</span><span class="token punctuation">,</span>
        <span class="token string">&quot;apiVersion&quot;</span>: <span class="token string">&quot;/v1&quot;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token string">&quot;metricName&quot;</span>: <span class="token string">&quot;nginx_vts_server_requests_per_second&quot;</span><span class="token punctuation">,</span>
      <span class="token string">&quot;timestamp&quot;</span>: <span class="token string">&quot;2020-08-02T04:07:06Z&quot;</span><span class="token punctuation">,</span>
      <span class="token string">&quot;value&quot;</span>: <span class="token string">&quot;133m&quot;</span><span class="token punctuation">,</span>
      <span class="token string">&quot;selector&quot;</span>: null
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中133m等于0.133，即当前指标查询每秒钟请求数为0.133次</p><p>https://github.com/DirectXMan12/k8s-prometheus-adapter/blob/master/docs/config-walkthrough.md</p><p>https://github.com/DirectXMan12/k8s-prometheus-adapter/blob/master/docs/config.md</p><h6 id="配置hpa实现自定义指标的业务伸缩" tabindex="-1"><a class="header-anchor" href="#配置hpa实现自定义指标的业务伸缩" aria-hidden="true">#</a> 配置HPA实现自定义指标的业务伸缩</h6><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ <span class="token function">cat</span> hpa-custom-metrics<span class="token punctuation">.</span>yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: nginx-custom-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: custom-metrics-demo
  minReplicas: 1
  maxReplicas: 3
  metrics:
  <span class="token operator">-</span> <span class="token function">type</span>: Pods
    pods:
      metric:
        name: nginx_vts_server_requests_per_second
      target:
        <span class="token function">type</span>: AverageValue
        averageValue: 10

$ kubectl create <span class="token operator">-</span>f hpa-custom-metrics<span class="token punctuation">.</span>yaml

$ kubectl get hpa
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意metricName为自定义的指标名称。</p><p>使用ab命令压测custom-metrics-demo服务，观察hpa的变化：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ kubectl get svc <span class="token operator">-</span>o wide
custom-metrics-demo   ClusterIP   10<span class="token punctuation">.</span>104<span class="token punctuation">.</span>110<span class="token punctuation">.</span>245   &lt;none&gt;        80/TCP    16h

$ ab <span class="token operator">-</span>n1000 <span class="token operator">-</span>c 5 http:<span class="token operator">/</span><span class="token operator">/</span>10<span class="token punctuation">.</span>104<span class="token punctuation">.</span>110<span class="token punctuation">.</span>245:80/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>观察hpa变化:</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ kubectl describe hpa nginx-custom-hpa
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>查看adapter日志：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ kubectl <span class="token operator">-</span>n monitor logs <span class="token operator">--</span>tail=100 <span class="token operator">-</span>f custom-metrics-apiserver-c689ff947-m5vlr
<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
I0802 04:43:58<span class="token punctuation">.</span>404559       1 httplog<span class="token punctuation">.</span>go:90<span class="token punctuation">]</span> GET <span class="token operator">/</span>apis/custom<span class="token punctuation">.</span>metrics<span class="token punctuation">.</span>k8s<span class="token punctuation">.</span>io/v1beta1/namespaces/default/pods/<span class="token operator">%</span>2A/nginx_vts_server_requests_per_second?labelSelector=app%3Dcustom-metrics-demo: <span class="token punctuation">(</span>20<span class="token punctuation">.</span>713209ms<span class="token punctuation">)</span> 200 <span class="token namespace">[kube-controller-manager/v1.16.0 (linux/amd64) kubernetes/2bd9643/system:serviceaccount:kube-system:horizontal-pod-autoscaler 172.21.51.67:60626]</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>实际的请求：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>http:<span class="token operator">/</span><span class="token operator">/</span>prometheus:9090/api/v1/query?query=<span class="token operator">%</span>28sum%28rate%28nginx_vts_server_requests_per_second%7Bkubernetes_namespace%3D%22default%22%2Ckubernetes_pod_name%3D~<span class="token operator">%</span>22custom-metrics-demo-95b5bc949-9vd8q%7Ccustom-metrics-demo-95b5bc949-qrpnp%22%2Cjob%3D%22kubernetes-sd-endpoints%22%7D%5B1m%5D%29%29+by+<span class="token operator">%</span>28kubernetes_pod_name

I1028 08:56:05<span class="token punctuation">.</span>289421       1 api<span class="token punctuation">.</span>go:74<span class="token punctuation">]</span> GET http:<span class="token operator">/</span><span class="token operator">/</span>prometheus:9090/api/v1/query?query=<span class="token operator">%</span>28sum%28rate%28nginx_vts_server_requests_total%7Bkubernetes_namespace%3D%22default%22%2Ckubernetes_pod_name%3D~<span class="token operator">%</span>22custom-metrics-demo-95b5bc949-9vd8q%7Ccustom-metrics-demo-95b5bc949-qrpnp%22%7D%5B1m%5D%29%29+by+<span class="token operator">%</span>28kubernetes_pod_name%29%29&amp;time=1603875365<span class="token punctuation">.</span>284 200 OK
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>补充：coredns通用指标的hpa</p><p>添加指标：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code>$ cat custom<span class="token punctuation">-</span>metrics<span class="token punctuation">-</span>configmap.yaml
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ConfigMap
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> adapter<span class="token punctuation">-</span>config
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> monitor
<span class="token key atrule">data</span><span class="token punctuation">:</span>
  <span class="token key atrule">config.yaml</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string">
    rules:
    - seriesQuery: &#39;nginx_vts_server_requests_total{host=&quot;*&quot;,code=&quot;total&quot;}&#39;
      seriesFilters: []
      resources:
        overrides:
          kubernetes_namespace: {resource: &quot;namespace&quot;}
          kubernetes_pod_name: {resource: &quot;pod&quot;}
      name:
        as: &quot;nginx_vts_server_requests_per_second&quot;
      metricsQuery: (sum(rate(&lt;&lt;.Series&gt;&gt;{&lt;&lt;.LabelMatchers&gt;&gt;}[1m])) by (&lt;&lt;.GroupBy&gt;&gt;))
    - seriesQuery: &#39;coredns_dns_request_count_total{job=&quot;kubernetes-sd-endpoints&quot;}&#39;
      seriesFilters: []
      resources:
        overrides:
          kubernetes_namespace: {resource: &quot;namespace&quot;}
          kubernetes_pod_name: {resource: &quot;pod&quot;}
      name:
        as: &quot;coredns_dns_request_count_total_1minute&quot;
      metricsQuery: (sum(rate(&lt;&lt;.Series&gt;&gt;{&lt;&lt;.LabelMatchers&gt;&gt;,job=&quot;kubernetes-sd-endpoints&quot;}[1m])) by (&lt;&lt;.GroupBy&gt;&gt;))</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>coredns的hpa文件：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code>$ cat coredns<span class="token punctuation">-</span>hpa.yaml
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> autoscaling/v2beta1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> HorizontalPodAutoscaler
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> coredns<span class="token punctuation">-</span>hpa
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> kube<span class="token punctuation">-</span>system
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">scaleTargetRef</span><span class="token punctuation">:</span>
    <span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
    <span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment
    <span class="token key atrule">name</span><span class="token punctuation">:</span> coredns
  <span class="token key atrule">minReplicas</span><span class="token punctuation">:</span> <span class="token number">2</span>
  <span class="token key atrule">maxReplicas</span><span class="token punctuation">:</span> <span class="token number">3</span>
  <span class="token key atrule">metrics</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">type</span><span class="token punctuation">:</span> Pods
    <span class="token key atrule">pods</span><span class="token punctuation">:</span>
      <span class="token key atrule">metricName</span><span class="token punctuation">:</span> coredns_dns_request_count_total_1minute
      <span class="token key atrule">targetAverageValue</span><span class="token punctuation">:</span> <span class="token number">1</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>hpa会拿pod、namespace去通过adaptor提供的api查询指标数据：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>sum<span class="token punctuation">(</span>rate<span class="token punctuation">(</span>coredns_dns_request_count_total<span class="token punctuation">{</span>kubernetes_namespace=<span class="token string">&quot;default&quot;</span><span class="token punctuation">,</span>kubernetes_pod_name=~<span class="token string">&quot;custom-metrics-demo-95b5bc949-9vd8q|custom-metrics-demo-95b5bc949-qrpnp&quot;</span><span class="token punctuation">,</span>job=<span class="token string">&quot;kubernetes-sd-endpoints&quot;</span><span class="token punctuation">}</span><span class="token punctuation">[</span>1m<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span> by <span class="token punctuation">(</span>kubernetes_pod_name<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>追加：Adapter查询数据和直接查询Prometheus数据不一致（相差4倍）的问题。</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ vi custom-metrics-configmap<span class="token punctuation">.</span>yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: adapter-config
  namespace: monitor
<span class="token keyword">data</span>:
  config<span class="token punctuation">.</span>yaml: <span class="token punctuation">|</span>
    rules:
    <span class="token operator">-</span> seriesQuery: <span class="token string">&#39;nginx_vts_server_requests_total{host=&quot;*&quot;,code=&quot;total&quot;}&#39;</span>
      seriesFilters: <span class="token punctuation">[</span><span class="token punctuation">]</span>
      resources:
        overrides:
          kubernetes_namespace: <span class="token punctuation">{</span>resource: <span class="token string">&quot;namespace&quot;</span><span class="token punctuation">}</span>
          kubernetes_pod_name: <span class="token punctuation">{</span>resource: <span class="token string">&quot;pod&quot;</span><span class="token punctuation">}</span>
      name:
        matches: <span class="token string">&quot;^(.*)_total&quot;</span>
        as: <span class="token string">&quot;\${1}_per_second&quot;</span>
      metricsQuery: <span class="token punctuation">(</span>sum<span class="token punctuation">(</span>rate<span class="token punctuation">(</span>&lt;&lt;<span class="token punctuation">.</span>Series&gt;&gt;<span class="token punctuation">{</span>&lt;&lt;<span class="token punctuation">.</span>LabelMatchers&gt;&gt;<span class="token punctuation">,</span>host=<span class="token string">&quot;*&quot;</span><span class="token punctuation">,</span>code=<span class="token string">&quot;total&quot;</span><span class="token punctuation">}</span><span class="token punctuation">[</span>1m<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span> by <span class="token punctuation">(</span>&lt;&lt;<span class="token punctuation">.</span>GroupBy&gt;&gt;<span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>查询验证：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>$ kubectl get <span class="token operator">--</span>raw <span class="token string">&quot;/apis/custom.metrics.k8s.io/v1beta1/namespaces/default/pods/*/nginx_vts_server_requests_per_second&quot;</span> <span class="token punctuation">|</span> jq 
<span class="token punctuation">{</span>
  <span class="token string">&quot;kind&quot;</span>: <span class="token string">&quot;MetricValueList&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;apiVersion&quot;</span>: <span class="token string">&quot;custom.metrics.k8s.io/v1beta1&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;metadata&quot;</span>: <span class="token punctuation">{</span>
    <span class="token string">&quot;selfLink&quot;</span>: <span class="token string">&quot;/apis/custom.metrics.k8s.io/v1beta1/namespaces/default/pods/%2A/nginx_vts_server_requests_per_second&quot;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token string">&quot;items&quot;</span>: <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token string">&quot;describedObject&quot;</span>: <span class="token punctuation">{</span>
        <span class="token string">&quot;kind&quot;</span>: <span class="token string">&quot;Pod&quot;</span><span class="token punctuation">,</span>
        <span class="token string">&quot;namespace&quot;</span>: <span class="token string">&quot;default&quot;</span><span class="token punctuation">,</span>
        <span class="token string">&quot;name&quot;</span>: <span class="token string">&quot;custom-metrics-demo-95b5bc949-xpppl&quot;</span><span class="token punctuation">,</span>
        <span class="token string">&quot;apiVersion&quot;</span>: <span class="token string">&quot;/v1&quot;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token string">&quot;metricName&quot;</span>: <span class="token string">&quot;nginx_vts_server_requests_per_second&quot;</span><span class="token punctuation">,</span>
      <span class="token string">&quot;timestamp&quot;</span>: <span class="token string">&quot;2020-08-02T04:07:06Z&quot;</span><span class="token punctuation">,</span>
      <span class="token string">&quot;value&quot;</span>: <span class="token string">&quot;133m&quot;</span><span class="token punctuation">,</span>
      <span class="token string">&quot;selector&quot;</span>: null
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,156);function dn(vn,mn){const a=c("ExternalLinkIcon");return u(),r("div",null,[V,n("ul",null,[R,I,n("li",null,[n("p",null,[n("a",E,[s("Fluentd"),e(a)])]),j,N,D,L])]),G,n("ul",null,[n("li",null,[n("p",null,[n("a",U,[s("source"),e(a)]),s(" ，数据源，对应Input 通过使用 source 指令，来选择和配置所需的输入插件来启用 Fluentd 输入源， source 把事件提交到 fluentd 的路由引擎中。使用type来区分不同类型的数据源。如下配置可以监听指定文件的追加输入：")]),O]),B]),H,n("p",null,[s("使用该网站进行正则校验： "),n("a",Y,[s("http://fluentular.herokuapp.com"),e(a)])]),F,n("ol",null,[Z,n("li",null,[n("p",null,[s("默认集成了 "),n("a",K,[s("kubernetes_metadata_filter"),e(a)]),s(" 插件，来解析日志格式，得到k8s相关的元数据，raw.kubernete")]),n("ul",null,[z,n("li",null,[Q,n("p",null,[s("👉"),n("a",W,[s("参考"),e(a)])]),J])])]),X]),nn,n("p",null,[s("除了直接导入Dashboard，我们还可以通过安装插件的方式获得，Configuration -> Plugins可以查看已安装的插件，通过 "),n("a",sn,[s("官方插件列表"),e(a)]),s(" 我们可以获取更多可用插件。")]),an,n("ul",null,[n("li",null,[n("a",en,[s("grafana-kubernetes-app"),e(a)])]),n("li",null,[n("a",tn,[s("devopsprodigy-kubegraf-app"),e(a)])])]),n("p",null,[n("a",ln,[s("DevOpsProdigy KubeGraf"),e(a)]),s(" 是一个非常优秀的 Grafana Kubernetes 插件，是 Grafana 官方的 Kubernetes 插件的升级版本，该插件可以用来可视化和分析 Kubernetes 集群的性能，通过各种图形直观的展示了 Kubernetes 集群的主要服务的指标和特征，还可以用于检查应用程序的生命周期和错误日志。")]),pn,n("ul",null,[n("li",null,[n("a",on,[s("global"),e(a)]),s(": 全局配置，包括报警解决后的超时时间、SMTP 相关配置、各种渠道通知的 API 地址等等。")]),n("li",null,[n("a",cn,[s("route"),e(a)]),s(": 用来设置报警的分发策略，它是一个树状结构，按照深度优先从左向右的顺序进行匹配。")]),n("li",null,[n("a",un,[s("receivers"),e(a)]),s(": 配置告警消息接受者信息，例如常用的 email、wechat、slack、webhook 等消息通知方式。")])]),rn])}const bn=o(T,[["render",dn],["__file","14_Docker_k8s教程-04日志监控.html.vue"]]);export{bn as default};
