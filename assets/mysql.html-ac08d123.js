import{_ as e,p as i,q as n,a1 as d}from"./framework-613df08c.js";const s={},a=d(`<h1 id="mysql" tabindex="-1"><a class="header-anchor" href="#mysql" aria-hidden="true">#</a> mysql</h1><blockquote><p>create by nohi 20210105</p></blockquote><ul><li><p>常用命令</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>登录：mysql -uroot -p123456
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li></ul><h2 id="创建用户" tabindex="-1"><a class="header-anchor" href="#创建用户" aria-hidden="true">#</a> 创建用户</h2><ul><li><p>mysql 8</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>CREATE USER &#39;nohi&#39;@&#39;%&#39; IDENTIFIED BY &#39;nohi&#39;;
GRANT ALL ON *.* TO &#39;nohi&#39;@&#39;%&#39;; 
ALTER USER &#39;nohi&#39;@&#39;%&#39; IDENTIFIED WITH mysql_native_password BY &#39;nohi&#39;;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>修改密码</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>参考：https://www.cnblogs.com/tmdsleep/p/10967432.html

mysql&gt; select host,user,authentication_string from mysql.user;
host: 允许用户登录的ip‘位置&#39;%表示可以远程；
user:当前数据库的用户名；
authentication_string: 用户密码（后面有提到此字段）；

1.8. 设置（或修改）root用户密码：
默认root密码为空的话 ，下面使用navicat就无法连接，所以我们需要修改root的密码。
这是很关键的一步。此处踩过N多坑，后来查阅很多才知道在mysql 5.7.9以后废弃了password字段和password()函数；authentication_string:字段表示用户密码。
下面直接演示正确修改root密码的步骤：

一、如果当前root用户authentication_string字段下有内容，先将其设置为空，否则直接进行二步骤。

use mysql; 
update user set authentication_string=&#39;&#39; where user=&#39;root&#39;

3.下面直接演示正确修改root密码的步骤：

二、使用ALTER修改root用户密码,方法为 ALTER user &#39;root&#39;@&#39;localhost&#39; IDENTIFIED BY &#39;新密码&#39;。如下：

ALTER user &#39;root&#39;@&#39;localhost&#39; IDENTIFIED BY &#39;JOhydhLfMsWyBcn#&#39;

此处有两点需要注意：
1、不需要flush privileges来刷新权限。
2、密码要包含大写字母，小写字母，数字，特殊符号。
修改成功； 重新使用用户名密码登录即可；

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h2 id="常用语句-函数" tabindex="-1"><a class="header-anchor" href="#常用语句-函数" aria-hidden="true">#</a> 常用语句/函数</h2><h3 id="日期-时间" tabindex="-1"><a class="header-anchor" href="#日期-时间" aria-hidden="true">#</a> 日期/时间</h3><div class="language-mysql line-numbers-mode" data-ext="mysql"><pre class="language-mysql"><code>-- 获取当前系统日期、时间
select sysdate() &quot;当前系统时间(年月日时分秒)&quot;, current_date &quot;日期&quot;, current_time &quot;时间&quot;,current_timestamp &quot;年月日时分秒&quot;;

-- 日期时间转换为字符串
select current_timestamp, date_format(current_timestamp, &#39;%Y-%m-%d&#39;), date_format(current_timestamp, &#39;%h-%i-%s&#39;);

-- 增加秒数
select now(), addtime(now(),1), addtime(now(),10), addtime(now(),-10); -- 加1秒
-- adddate 增加 秒、时、天、月、年
select now() 当前, adddate(now(),1) 一天后, adddate(now(), interval 1 day) 一天后, adddate(now(), interval 1 hour) 一小时后,adddate(now(), interval 1 month ) 一月后 ;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="递归with-recursive" tabindex="-1"><a class="header-anchor" href="#递归with-recursive" aria-hidden="true">#</a> 递归<code>WITH RECURSIVE</code></h3><div class="language-mysql line-numbers-mode" data-ext="mysql"><pre class="language-mysql"><code> -- 查询子节点  含自己
 WITH RECURSIVE DATA_ZONE_TREE (id, pid, deep, name, pinyin_prefix, pinyin, ext_id, ext_name) AS
      (
         SELECT T1.id, T1.pid, T1.deep, T1.name, T1.pinyin_prefix, T1.pinyin, T1.ext_id, T1.ext_name
         from DATA_ZONE T1
         where T1.ID = &#39;341122&#39;
         UNION ALL
         SELECT T2.id, T2.pid, T2.deep, T2.name, T2.pinyin_prefix, T2.pinyin, T2.ext_id, T2.ext_name
         from DATA_ZONE T2, DATA_ZONE_TREE T3
         WHERE T2.pid = T3.id
       )
SELECT T.* FROM DATA_ZONE_TREE T ;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="行转列group-concat" tabindex="-1"><a class="header-anchor" href="#行转列group-concat" aria-hidden="true">#</a> 行转列<code>group_concat</code></h3><div class="language-mysql line-numbers-mode" data-ext="mysql"><pre class="language-mysql"><code>WITH RECURSIVE DATA_ZONE_TREE (id, pid, deep, name, pinyin_prefix, pinyin, ext_id, ext_name) AS
       (
         SELECT T1.id, T1.pid, T1.deep, T1.name, T1.pinyin_prefix, T1.pinyin, T1.ext_id, T1.ext_name
         from DATA_ZONE T1
         where T1.ID = &#39;341122&#39;
         UNION ALL
         SELECT T2.id, T2.pid, T2.deep, T2.name, T2.pinyin_prefix, T2.pinyin, T2.ext_id, T2.ext_name
         from DATA_ZONE T2, DATA_ZONE_TREE T3
         WHERE T2.id = T3.pid
       )
select group_concat(ext_name order by deep separator &#39;&#39;) INTO returnValue
from ( SELECT distinct ext_name , max(deep) deep FROM DATA_ZONE_TREE T group by ext_name order by deep ) RS order by deep;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,12),l=[a];function r(t,v){return i(),n("div",null,l)}const u=e(s,[["render",r],["__file","mysql.html.vue"]]);export{u as default};
