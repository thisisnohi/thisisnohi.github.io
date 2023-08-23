import{_ as e,p as r,q as a,a1 as o}from"./framework-449724a9.js";const i={},t=o(`<h1 id="springcloudalibaba" tabindex="-1"><a class="header-anchor" href="#springcloudalibaba" aria-hidden="true">#</a> SpringCloudAlibaba</h1><blockquote><p>create by nohi 20220605</p></blockquote><h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h2><ul><li><p>官方文档：https://spring-cloud-alibaba-group.github.io/github-pages/2021/zh-cn/index.html#_introduction</p><ul><li>Readme:https://github.com/alibaba/spring-cloud-alibaba/blob/2021.x/README-zh.md</li></ul></li><li><p>本地代码：</p></li></ul><h2 id="nacos" tabindex="-1"><a class="header-anchor" href="#nacos" aria-hidden="true">#</a> Nacos</h2><blockquote><p>见：Nacos.md</p></blockquote><h2 id="sentinel" tabindex="-1"><a class="header-anchor" href="#sentinel" aria-hidden="true">#</a> Sentinel</h2><p><strong>流量控制规则</strong>、<strong>熔断降级规则</strong>、<strong>系统保护规则</strong>、<strong>来源访问控制规则</strong> 和 <strong>热点参数规则</strong>。</p><ul><li>WIKI/介绍/文档：https://github.com/alibaba/Sentinel/wiki/%E4%BB%8B%E7%BB%8D</li></ul><h3 id="控制台" tabindex="-1"><a class="header-anchor" href="#控制台" aria-hidden="true">#</a> 控制台</h3><p>启动：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>java -Dserver.port=8080 -Dcsp.sentinel.dashboard.server=localhost:8080 -Dproject.name=sentinel-dashboard -jar sentinel-dashboard.jar
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>默认用户名密码： sentinel/sentinel</li><li>sentinel控制台一直没有对应服务 <ul><li>需要发起一个请求，sentinel才会显示</li><li>客户端向注册中心注册时，客户端ip需要可达</li></ul></li></ul><h3 id="参考示例" tabindex="-1"><a class="header-anchor" href="#参考示例" aria-hidden="true">#</a> 参考示例</h3><blockquote><p>https://www.jianshu.com/p/7616fbc915af</p></blockquote><h2 id="dubbo" tabindex="-1"><a class="header-anchor" href="#dubbo" aria-hidden="true">#</a> Dubbo</h2><h3 id="参考-1" tabindex="-1"><a class="header-anchor" href="#参考-1" aria-hidden="true">#</a> 参考：</h3><ul><li>Spring Cloud Alibaba 教程 | Dubbo（一）https://www.jianshu.com/p/0d53c5bcda28</li><li>https://blog.csdn.net/g5zhu5896/article/details/122588793</li></ul><h3 id="key-point" tabindex="-1"><a class="header-anchor" href="#key-point" aria-hidden="true">#</a> Key Point</h3><ul><li>dubbo配置：需要group相同，否则dubbo admin获取不到无数据</li></ul><ul><li>[ ] \`\`\` dubbo: cloud: subscribed-services: \${spring.application.name} protocol: name: dubbo # 这个dubbo的协议端口在一台服务器上的时候，每个项目的必须配置成不一样的（否则将启动失败），或者配置为-1，使用随机端口 port: 20881 host: 127.0.0.1 registry: # 由于使用的是spring-cloud，因此这里使用spring-cloud的 <h1 id="address-spring-cloud-127-0-0-1-8848" tabindex="-1"><a class="header-anchor" href="#address-spring-cloud-127-0-0-1-8848" aria-hidden="true">#</a> address: spring-cloud://127.0.0.1:8848</h1><pre><code>address: nacos://127.0.0.1:8848?group=dubbo
</code></pre> scan: # 配置需要扫描的注解包 base-packages: nohi.cloud<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li></ul><h2 id="rocketmq简介" tabindex="-1"><a class="header-anchor" href="#rocketmq简介" aria-hidden="true">#</a> RocketMQ简介</h2><h3 id="参考-2" tabindex="-1"><a class="header-anchor" href="#参考-2" aria-hidden="true">#</a> 参考</h3><ul><li><p>docker：https://blog.csdn.net/apple_csdn/article/details/125277508</p><p>窗口中文件路径为：/home/rocketmq 而非 /root/rocketmq</p></li><li><p>安装版本：https://blog.csdn.net/qq_40744423/article/details/124429251</p></li></ul><h3 id="主题" tabindex="-1"><a class="header-anchor" href="#主题" aria-hidden="true">#</a> 主题</h3><h4 id="broker" tabindex="-1"><a class="header-anchor" href="#broker" aria-hidden="true">#</a> Broker</h4><blockquote><p>其实就是 RocketMQ 服务器，负责存储消息、转发消息</p></blockquote><ul><li><strong>路由模块</strong>：整个 Broker 的实体，负责处理来自 clients 端的请求。</li><li><strong>客户端管理</strong>：负责管理客户端(Producer/Consumer)和维护 Consumer 的 Topic 订阅信息</li><li><strong>存储服务</strong>：提供方便简单的 API 接口处理消息存储到物理硬盘和查询功能。</li><li><strong>高可用服务</strong>：高可用服务，提供 Master Broker 和 Slave Broker 之间的数据同步功能。</li><li><strong>消息索引服务</strong>：根据特定的 Message key 对投递到 Broker 的消息进行索引服务，以提供消息的快速查询。</li></ul><h4 id="nameserver" tabindex="-1"><a class="header-anchor" href="#nameserver" aria-hidden="true">#</a> NameServer</h4><blockquote><p>Topic 路由注册中心</p></blockquote><ul><li><strong>Broker 管理</strong>：NameServer 接受 Broker 集群的注册信息并且保存下来作为路由信息的基本数据。然后提供心跳检测机制，检查 Broker 是否还存活；</li><li><strong>路由信息管理</strong>：给 Producer 和 Consumer 提供服务获取 Broker 列表。每个 NameServer 将保存关于 Broker 集群的整个路由信息和用于客户端查询的队列信息。然后 Producer 和 Conumser 通过 NameServer 就可以知道整个 Broker 集群的路由信息，从而进行消息的投递和消费。</li></ul><h3 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h3><ul><li><p>网络连接</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>docker network create rocketmq
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li><li><p>Name Server</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>docker run -d --name rocketmq-namesrv --network rocketmq -p 9876:9876 -v /opt/docker_volumes/rocketmq/namesrv/logs:/home/rocketmq/logs -v /opt/docker_volumes/rocketmq/namesrv/store:/home/rocketmq/store apache/rocketmq:4.9.3 sh mqnamesrv
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li><li><p>Broker</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>-- 拷贝Image配置到 本地目录
docker cp 69b3f6495841:/home/rocketmq/rocketmq-4.9.3/conf /opt/docker_volumes/rocketmq/broker-a

docker run -d --name rocketmq-broker-a -p 10909:10909 -p 10911:10911 -v /opt/docker_volumes/rocketmq/broker-a/logs:/root/logs -v /opt/docker_volumes/rocketmq/broker-a/store:/root/store -v /opt/docker_volumes/rocketmq/broker-a/conf:/home/rocketmq/rocketmq-4.9.3/conf  apache/rocketmq:4.9.3 sh mqbroker -c /home/rocketmq/rocketmq-4.9.3/conf/broker.conf

-- 指定内存
docker run -d --name rocketmq-broker-a --network rocketmq -p 10909:10909 -p 10911:10911 -v /opt/docker_volumes/rocketmq/broker-a/logs:/root/logs -v /opt/docker_volumes/rocketmq/broker-a/store:/root/store -v /opt/docker_volumes/rocketmq/broker-a/conf:/home/rocketmq/rocketmq-4.9.3/conf -e &quot;JAVA_OPT_EXT=-server -Xms256m -Xmx256m -Xmn256m&quot; apache/rocketmq:4.9.3 sh mqbroker -c /home/rocketmq/rocketmq-4.9.3/conf/broker.conf

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>console控制台搭建</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>docker run -d --name rocketmq-console --network rocketmq -e &quot;JAVA_OPTS=-Drocketmq.namesrv.addr=rocketmq-namesrv:9876 -Dcom.rocketmq.sendMessageWithVIPChannel=false&quot; -p 8081:8080 apacherocketmq/rocketmq-dashboard:latest
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>访问：http://10.0.0.210:10000/ http://127.0.0.1:8081</li></ul></li></ul>`,33),n=[t];function s(d,l){return r(),a("div",null,n)}const u=e(i,[["render",s],["__file","SpringCloudAlibaba.html.vue"]]);export{u as default};
