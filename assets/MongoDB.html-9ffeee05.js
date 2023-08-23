import{_ as n,p as a,q as s,a1 as e}from"./framework-449724a9.js";const t="/assets/v2-23df3200d4d576f29060c934e51abad2_1440w-50d06950.webp",i="/assets/v2-4a4ce8ff9c69d5402f70baa1b050ad0d_1440w-78a819b2.webp",o={},l=e('<h1 id="mongodb" tabindex="-1"><a class="header-anchor" href="#mongodb" aria-hidden="true">#</a> MongoDB</h1><blockquote><p>create nohi 20230814</p></blockquote><ul><li>支持acid</li></ul><p>文档数据库</p><h2 id="简介" tabindex="-1"><a class="header-anchor" href="#简介" aria-hidden="true">#</a> 简介</h2><p>MongoDB是一款为web应用程序和互联网基础设施设计的数据库管理系统。没错MongoDB就是数据库，是NoSQL类型的数据库</p><h3 id="特性" tabindex="-1"><a class="header-anchor" href="#特性" aria-hidden="true">#</a> 特性：</h3><ul><li>面向文档存储，基于JSON/BSON 可表示灵活的数据结构</li><li>动态 DDL能力，没有强Schema约束，支持快速迭代</li><li>高性能计算，提供基于内存的快速数据查询</li><li>容易扩展，利用数据分片可以支持海量数据存储</li><li>丰富的功能集，支持二级索引、强大的聚合管道功能，为开发者量身定做的功能，如数据自动老化、固定集合等等。</li><li>跨平台版本、支持多语言SDK.</li></ul><h3 id="概念" tabindex="-1"><a class="header-anchor" href="#概念" aria-hidden="true">#</a> 概念</h3><p><img src="'+t+'" alt="img"></p><ul><li>database 数据库，与SQL的数据库(database)概念相同，一个数据库包含多个集合(表)</li><li>collection 集合，相当于SQL中的表(table)，一个集合可以存放多个文档(行)。 不同之处就在于集合的结构(schema)是动态的，不需要预先声明一个严格的表结构。更重要的是，默认情况下 MongoDB 并不会对写入的数据做任何schema的校验。</li><li>document 文档，相当于SQL中的行(row)，一个文档由多个字段(列)组成，并采用bson(json)格式表示。</li><li>field 字段，相当于SQL中的列(column)，相比普通column的差别在于field的类型可以更加灵活，比如支持嵌套的文档、数组。 此外，MongoDB中字段的类型是固定的、区分大小写、并且文档中的字段也是有序的。</li></ul><p><img src="'+i+`" alt="img"></p><ul><li>_id 主键，MongoDB 默认使用一个_id 字段来保证文档的唯一性。</li><li>reference 引用，勉强可以对应于 外键(foreign key) 的概念，之所以是勉强是因为 reference 并没有实现任何外键的约束，而只是由客户端(driver)自动进行关联查询、转换的一个特殊类型。</li><li>view 视图，MongoDB 3.4 开始支持视图，和 SQL 的视图没有什么差异，视图是基于表/集合之上进行动态查询的一层对象，可以是虚拟的，也可以是物理的(物化视图)。</li><li>index 索引，与SQL 的索引相同。</li><li>$lookup，这是一个聚合操作符，可以用于实现类似 SQL-join 连接的功能</li><li>transaction 事务，从 MongoDB 4.0 版本开始，提供了对于事务的支持</li><li>aggregation 聚合，MongoDB 提供了强大的聚合计算框架，group by 是其中的一类聚合操作。</li></ul><h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h2><blockquote><p>参考：https://zhuanlan.zhihu.com/p/610560696</p></blockquote><ul><li><p>拉取最新镜像</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 搜索可用镜像</span>
<span class="token function">docker</span> search mongo
<span class="token comment"># 拉取最新镜像</span>
<span class="token function">docker</span> pull mongo:latest
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>运行一个MongoDB窗口</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker</span> run <span class="token parameter variable">-itd</span> <span class="token parameter variable">--name</span> mongo-test <span class="token parameter variable">-p</span> <span class="token number">27017</span>:27017 mongo <span class="token parameter variable">--auth</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>参数说明：</strong></p><ul><li>**-itd：**其中，i是交互式操作，t是一个终端，d指的是在后台运行。</li><li>**--name mongo-test：**容器名称</li><li><strong>-p 27017:27017</strong> ：映射容器服务的 27017 端口到宿主机的 27017 端口。外部可以直接通过 宿主机 ip:27017 访问到 mongo 的服务。</li><li><strong>--auth</strong>：需要密码才能访问容器服务（注意：安全问题，MongoDB默认是不开启权限验证的，不过设置了这里就相当于修改MongoDB的配置auth=ture启用权限访问）。</li></ul></li><li><p>进入创建的MongoDB容器</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>docker exec -it mongo-test mongosh
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li><p>在admin数据库中通过创建一个用户，赋予用户root权限</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># 进入admin数据库 use admin 
# 创建一个超级用户 db.createUser({ user:&quot;root&quot;, pwd:&quot;123456&quot;, roles:[{role:&quot;root&quot;,db:&quot;admin&quot;}] } );

#授权登录
db.auth(&#39;root&#39;,&#39;123456&#39;)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul></li></ul><h3 id="用户权限管理" tabindex="-1"><a class="header-anchor" href="#用户权限管理" aria-hidden="true">#</a> 用户权限管理</h3><h4 id="mongodb添加用户命令说明" tabindex="-1"><a class="header-anchor" href="#mongodb添加用户命令说明" aria-hidden="true">#</a> <strong>MongoDB添加用户命令说明</strong></h4><ul><li>user字段，为新用户的名字。</li><li>pwd字段，用户的密码。</li><li>cusomData字段，为任意内容，例如可以为用户全名介绍。</li><li>roles字段，指定用户的角色，可以用一个空数组给新用户设定空角色。在roles字段,可以指定内置角色和用户定义的角色。</li><li>超级用户的role有两种，userAdmin或者userAdminAnyDatabase(比前一种多加了对所有数据库的访问,仅仅是访问而已)。</li><li>db是指定数据库的名字，admin是管理数据库。</li><li>不能用admin数据库中的用户登录其他数据库。注：只能查看当前数据库中的用户，哪怕当前数据库admin数据库，也只能查看admin数据库中创建的用户。</li></ul><h4 id="创建admin超级管理员用户" tabindex="-1"><a class="header-anchor" href="#创建admin超级管理员用户" aria-hidden="true">#</a> <strong>创建admin超级管理员用户</strong></h4><blockquote><p>指定用户的角色和数据库： (注意此时添加的用户都只用于admin数据库，而非你存储业务数据的数据库) (在cmd中敲多行代码时，直接敲回车换行，最后以分号首尾)</p></blockquote><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>db.createUser<span class="token punctuation">(</span><span class="token punctuation">{</span> user: <span class="token string">&quot;admin&quot;</span>, pwd: <span class="token string">&quot;admin&quot;</span>, 
  customData:<span class="token punctuation">{</span>description:<span class="token string">&quot;superuser&quot;</span><span class="token punctuation">}</span>,
	roles: <span class="token punctuation">[</span> <span class="token punctuation">{</span> role: <span class="token string">&quot;userAdminAnyDatabase&quot;</span>, db: <span class="token string">&quot;admin&quot;</span> <span class="token punctuation">}</span> <span class="token punctuation">]</span> <span class="token punctuation">}</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="创建一个不受访问限制的超级用户" tabindex="-1"><a class="header-anchor" href="#创建一个不受访问限制的超级用户" aria-hidden="true">#</a> <strong>创建一个不受访问限制的超级用户</strong></h4><blockquote><p>拥有所有权限，不受任何限制</p></blockquote><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>db.createUser<span class="token punctuation">(</span><span class="token punctuation">{</span> user:<span class="token string">&quot;root&quot;</span>, pwd:<span class="token string">&quot;123456&quot;</span>, 
	roles:<span class="token punctuation">[</span><span class="token punctuation">{</span>role:<span class="token string">&quot;root&quot;</span>,db:<span class="token string">&quot;admin&quot;</span><span class="token punctuation">}</span><span class="token punctuation">]</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="创建一个业务数据用户" tabindex="-1"><a class="header-anchor" href="#创建一个业务数据用户" aria-hidden="true">#</a> 创建一个业务数据用户</h4><blockquote><p>只允许访问特定数据库</p></blockquote><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>db.createUser<span class="token punctuation">(</span><span class="token punctuation">{</span> user:<span class="token string">&quot;demouser&quot;</span>, pwd:<span class="token string">&quot;123456&quot;</span>, 
	roles:<span class="token punctuation">[</span><span class="token punctuation">{</span>role:<span class="token string">&quot;readWrite&quot;</span>,db:<span class="token string">&quot;demodb&quot;</span><span class="token punctuation">}</span>,<span class="token punctuation">{</span>role:<span class="token string">&quot;dbAdmin&quot;</span>,db:<span class="token string">&quot;demodb&quot;</span><span class="token punctuation">}</span><span class="token punctuation">]</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="数据库角色说明" tabindex="-1"><a class="header-anchor" href="#数据库角色说明" aria-hidden="true">#</a> 数据库角色说明</h3><ul><li>数据库用户角色：read、readWrite；</li><li>数据库管理角色：dbAdmin、dbOwner、userAdmin;</li><li>集群管理角色：clusterAdmin、clusterManager、4. clusterMonitor、hostManage；</li><li>备份恢复角色：backup、restore；</li><li>所有数据库角色：readAnyDatabase、readWriteAnyDatabase、userAdminAnyDatabase、dbAdminAnyDatabase</li><li>超级用户角色：root</li><li>内部角色：__system</li></ul><h4 id="mongodb中的role详解" tabindex="-1"><a class="header-anchor" href="#mongodb中的role详解" aria-hidden="true">#</a> <strong>MongoDB中的role详解</strong></h4><ul><li>Read：允许用户读取指定数据库</li><li>readWrite：允许用户读写指定数据库</li><li>dbAdmin：允许用户在指定数据库中执行管理函数，如索引创建、删除，查看统计或访问system.profile</li><li>userAdmin：允许用户向system.users集合写入，可以在指定数据库里创建、删除和管理用户</li><li>clusterAdmin：只在admin数据库中可用，赋予用户所有分片和复制集相关函数的管理权限</li><li>readAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读权限</li><li>readWriteAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读写权限</li><li>userAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的userAdmin权限</li><li>dbAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的dbAdmin权限</li><li>root：只在admin数据库中可用。超级账号，超级权限</li></ul><h2 id="三、操作语法" tabindex="-1"><a class="header-anchor" href="#三、操作语法" aria-hidden="true">#</a> <strong>三、操作语法</strong></h2><ul><li><p>新增</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code>db.book.insert(
<span class="token punctuation">{</span>
  title<span class="token operator">:</span> <span class="token string">&quot;My first blog post&quot;</span><span class="token punctuation">,</span>
  published<span class="token operator">:</span> new Date()<span class="token punctuation">,</span>
  tags<span class="token operator">:</span> <span class="token punctuation">[</span> <span class="token string">&quot;NoSQL&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;MongoDB&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">,</span>
  type<span class="token operator">:</span> <span class="token string">&quot;Work&quot;</span><span class="token punctuation">,</span>
  author <span class="token operator">:</span> <span class="token string">&quot;James&quot;</span><span class="token punctuation">,</span>
  viewCount<span class="token operator">:</span> <span class="token number">25</span><span class="token punctuation">,</span>
  commentCount<span class="token operator">:</span> <span class="token number">2</span>
<span class="token punctuation">}</span>
)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>查询</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code>db.book.find(<span class="token punctuation">{</span>author <span class="token operator">:</span> <span class="token string">&quot;James&quot;</span><span class="token punctuation">}</span>)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li><p>限定显示字段</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>-- 限定显示字段
db.book.find({&quot;author&quot;: &quot;James&quot;}, 
    {&quot;_id&quot;: 1, &quot;title&quot;: 1, &quot;author&quot;: 1})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>简单的分页查询</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>db.book.find({})
    .sort({&quot;viewCount&quot; : -1})
    .skip(10).limit(5)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul></li><li><p>更新</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code>db.book.update(<span class="token punctuation">{</span>author<span class="token operator">:</span><span class="token string">&quot;James&quot;</span><span class="token punctuation">}</span><span class="token punctuation">,</span><span class="token punctuation">{</span>$set<span class="token operator">:</span><span class="token punctuation">{</span>viewCount<span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">}</span><span class="token punctuation">}</span>)
db.book.findOneAndUpdate(<span class="token punctuation">{</span>author<span class="token operator">:</span><span class="token string">&quot;James&quot;</span><span class="token punctuation">}</span><span class="token punctuation">,</span><span class="token punctuation">{</span>$set<span class="token operator">:</span><span class="token punctuation">{</span>viewCount<span class="token operator">:</span> <span class="token number">4</span><span class="token punctuation">}</span><span class="token punctuation">}</span>);
db.book.updateMany(<span class="token punctuation">{</span>author<span class="token operator">:</span><span class="token string">&quot;A&quot;</span><span class="token punctuation">}</span><span class="token punctuation">,</span><span class="token punctuation">{</span>$set<span class="token operator">:</span><span class="token punctuation">{</span>viewCount<span class="token operator">:</span> +<span class="token number">1</span><span class="token punctuation">}</span><span class="token punctuation">}</span>);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>删除</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code>db.book.remove(<span class="token punctuation">{</span><span class="token property">&quot;_id&quot;</span><span class="token operator">:</span>
     ObjectId(<span class="token string">&quot;64dc74234f21f508dfffeeef&quot;</span>)<span class="token punctuation">}</span>)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li></ul>`,34),p=[l];function u(d,r){return a(),s("div",null,p)}const m=n(o,[["render",u],["__file","MongoDB.html.vue"]]);export{m as default};
