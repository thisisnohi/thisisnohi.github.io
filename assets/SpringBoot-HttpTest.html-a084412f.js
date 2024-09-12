import{_ as t,p as a,q as n,a1 as o}from"./framework-613df08c.js";const e="/assets/image-20230911204946351-864f90fe.png",s="/assets/image-20230911205020857-afc62973.png",u={},i=o(`<h1 id="http-test" tabindex="-1"><a class="header-anchor" href="#http-test" aria-hidden="true">#</a> HTTP Test</h1><blockquote><p>create by nohi 20230911</p></blockquote><ul><li>测试Springboot 并发情况，tomcat/webflux</li><li>测试普通jar和native情况</li></ul><h2 id="环境" tabindex="-1"><a class="header-anchor" href="#环境" aria-hidden="true">#</a> 环境</h2><ul><li><p>java version &quot;17.0.7&quot; 2023-04-18 LTS</p></li><li><p>SpringBoot3</p></li><li><p>OS: Darwin nohis-MacBook-Pro.local 22.6.0</p></li><li><p>代码：<code>https://github.com/thisisnohi/SpringCloud2022.git</code> 分支：feature-demo</p><ul><li><p>工程：nohi-web-native</p></li><li><p>Native:<code>mvn -Pnative -Dmaven.test.skip=true clean package</code></p></li><li><p>普通Springboot Jar: &#39;替换build&#39;</p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>build</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>plugins</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>plugin</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>org.springframework.boot<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>spring-boot-maven-plugin<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>plugin</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>plugins</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>build</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul></li></ul><h2 id="服务说明" tabindex="-1"><a class="header-anchor" href="#服务说明" aria-hidden="true">#</a> 服务说明</h2><ul><li><p>测试RSA加密加签</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>URL /rsa/encode  POST application/json
请求：
{
  &quot;traceId&quot;: &quot;20230618000011110001&quot;,
  &quot;acctNo&quot;: &quot;6225888811112222&quot;,
  &quot;acctName&quot;: &quot;测试账号&quot;
}

响应
{
  &quot;retCode&quot;: &quot;SUC&quot;,
  &quot;retMsg&quot;: &quot;&quot;,
  &quot;time&quot;: null,
  &quot;acctNo&quot;: &quot;6225888811112222&quot;,
  &quot;acctName&quot;: null,
  &quot;data&quot;: &quot;FMdbytHD4pCiVLu0LTJe3bUgI+JQUGDST1sXfF6WBlheJ+FcSpSrZ1xCzp6iLrnbVf/50zl/QLoyVo7pLn/OA7kPYISL41N8/Bl3bGA+tKabIRyD1+CAD0KuoRP6k0AxwqK6clUkyrALzfM1QysexHpyLTh+8yxGZbjhyg2drWF8rE5Fitt7tTWUVqopMnroZWITWrlyRZptA4jpDK+y0ZyY7EJyn3A0R+Wk4M+eB2kw5ZaQUGdbUscqS00UwtEtC01J2phjzFsK2vCIyPjtT+mpw5o3XB9FlDpwtDnWsCdduHYXk9KOSRF0OEHcE7AYJcNqkMqXH0pz1b3E8FBoxw==&quot;,
  &quot;sign&quot;: &quot;MkatX8p9RMmxw1fcw3gtGN3XGKbsdUAKb2B+dQmfR4EZc1Su8FphgFHgi6mOxyHg0PhyMAoqgblSqShgzAW4rRPLW+4Kh8sAS64Rud53fV8cVADD5OzJajRZ/wtV/VAsRwr1H1Hy7h+EDF5mKJJi0myCLxWO5cDyWdzfoTtt0fnQeIxgVyL7QpQsdEA6MnK2LfcEkEAfX2RXY1aoMT7qnrNNXGipTc4StvQHFGcmo8va5PFKEf+T4loPsvhFAljsToCHJH+OOmo7RiDM+lyJmY+AtEW676ZSY3RrRCnmj4s22LA9EmNnlSW/twa4Y0grMvx8ucdjJJazOTkqe1NlkQ==&quot;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><code>/rsa/testJson</code></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>/rsa/testJson POST application/json
请求：
{
  &quot;traceId&quot;: &quot;20230618000011110001&quot;,
  &quot;acctNo&quot;: &quot;6225888811112222&quot;,
  &quot;acctName&quot;: &quot;测试账号&quot;
}

响应：
{
  &quot;retCode&quot;: &quot;SUC&quot;,
  &quot;retMsg&quot;: &quot;&quot;,
  &quot;time&quot;: null,
  &quot;acctNo&quot;: null,
  &quot;acctName&quot;: null,
  &quot;data&quot;: &quot;[{\\&quot;acctNo\\&quot;:\\&quot;1\\&quot;,\\&quot;acctName\\&quot;:\\&quot;2\\&quot;,\\&quot;dateTime\\&quot;:\\&quot;2023-09-11T13:06:01.719630\\&quot;,\\&quot;amt\\&quot;:0,\\&quot;balance\\&quot;:100},{\\&quot;acctNo\\&quot;:\\&quot;1\\&quot;,\\&quot;acctName\\&quot;:\\&quot;2\\&quot;,\\&quot;dateTime\\&quot;:\\&quot;2023-09-11T13:06:01.719677\\&quot;,\\&quot;amt\\&quot;:1,\\&quot;balance\\&quot;:99},{\\&quot;acctNo\\&quot;:\\&quot;1\\&quot;,\\&quot;acctName\\&quot;:\\&quot;2\\&quot;,\\&quot;dateTime\\&quot;:\\&quot;2023-09-11T13:06:01.719685\\&quot;,\\&quot;amt\\&quot;:2,\\&quot;balance\\&quot;:98},{\\&quot;acctNo\\&quot;:\\&quot;1\\&quot;,\\&quot;acctName\\&quot;:\\&quot;2\\&quot;,\\&quot;dateTime\\&quot;:\\&quot;2023-09-11T13:06:01.719691\\&quot;,\\&quot;amt\\&quot;:3,\\&quot;balance\\&quot;:97},{\\&quot;acctNo\\&quot;:\\&quot;1\\&quot;,\\&quot;acctName\\&quot;:\\&quot;2\\&quot;,\\&quot;dateTime\\&quot;:\\&quot;2023-09-11T13:06:01.719696\\&quot;,\\&quot;amt\\&quot;:4,\\&quot;balance\\&quot;:96},{\\&quot;acctNo\\&quot;:\\&quot;1\\&quot;,\\&quot;acctName\\&quot;:\\&quot;2\\&quot;,\\&quot;dateTime\\&quot;:\\&quot;2023-09-11T13:06:01.719701\\&quot;,\\&quot;amt\\&quot;:5,\\&quot;balance\\&quot;:95},{\\&quot;acctNo\\&quot;:\\&quot;1\\&quot;,\\&quot;acctName\\&quot;:\\&quot;2\\&quot;,\\&quot;dateTime\\&quot;:\\&quot;2023-09-11T13:06:01.719706\\&quot;,\\&quot;amt\\&quot;:6,\\&quot;balance\\&quot;:94},{\\&quot;acctNo\\&quot;:\\&quot;1\\&quot;,\\&quot;acctName\\&quot;:\\&quot;2\\&quot;,\\&quot;dateTime\\&quot;:\\&quot;2023-09-11T13:06:01.719711\\&quot;,\\&quot;amt\\&quot;:7,\\&quot;balance\\&quot;:93},{\\&quot;acctNo\\&quot;:\\&quot;1\\&quot;,\\&quot;acctName\\&quot;:\\&quot;2\\&quot;,\\&quot;dateTime\\&quot;:\\&quot;2023-09-11T13:06:01.719723\\&quot;,\\&quot;amt\\&quot;:8,\\&quot;balance\\&quot;:92},{\\&quot;acctNo\\&quot;:\\&quot;1\\&quot;,\\&quot;acctName\\&quot;:\\&quot;2\\&quot;,\\&quot;dateTime\\&quot;:\\&quot;2023-09-11T13:06:01.719728\\&quot;,\\&quot;amt\\&quot;:9,\\&quot;balance\\&quot;:91}]&quot;,
  &quot;sign&quot;: null
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h2 id="测试" tabindex="-1"><a class="header-anchor" href="#测试" aria-hidden="true">#</a> 测试</h2><h3 id="rsa-encode" tabindex="-1"><a class="header-anchor" href="#rsa-encode" aria-hidden="true">#</a> <code>/rsa/encode</code></h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>-- jar
jmeter -n -t /Users/nohi/work/jemeter/20230911-httptest/压测RSA.jmx -l /Users/nohi/work/jemeter/20230911-httptest/report/202309111-jar.csv -e -o /Users/nohi/work/jemeter/20230911-httptest/report/20230911-jar

-- natvie
jmeter -n -t /Users/nohi/work/jemeter/20230911-httptest/压测RSA.jmx -l /Users/nohi/work/jemeter/20230911-httptest/report/202309111-navtie.csv -e -o /Users/nohi/work/jemeter/20230911-httptest/report/20230911-navtie
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="结果" tabindex="-1"><a class="header-anchor" href="#结果" aria-hidden="true">#</a> 结果</h4><ul><li><p>jar</p><p><img src="`+e+'" alt="image-20230911204946351"></p></li><li><p>native</p><p><img src="'+s+'" alt="image-20230911205020857"></p></li></ul>',12),l=[i];function c(q,d){return a(),n("div",null,l)}const p=t(u,[["render",c],["__file","SpringBoot-HttpTest.html.vue"]]);export{p as default};
