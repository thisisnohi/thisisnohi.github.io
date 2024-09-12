import{_ as n,p as s,q as a,a1 as e}from"./framework-613df08c.js";const p={},t=e(`<h1 id="造数及脱敏方法" tabindex="-1"><a class="header-anchor" href="#造数及脱敏方法" aria-hidden="true">#</a> 造数及脱敏方法</h1><ul><li><p>区划、街道</p><blockquote><p>参考：<code>https://gitee.com/xiangyuecn/AreaCity-JsSpider-StatsGov#https://gitee.com/xiangyuecn/AreaCity-JsSpider-StatsGov/releases/download/2023.240319.240616/ok_data_level3-4.csv.7z</code></p></blockquote></li></ul><h2 id="造数" tabindex="-1"><a class="header-anchor" href="#造数" aria-hidden="true">#</a> 造数</h2><h3 id="说明" tabindex="-1"><a class="header-anchor" href="#说明" aria-hidden="true">#</a> 说明</h3><ul><li>模拟真实数据，如人名、籍贯、地址、手机号、学校、学历 <ul><li>年龄、身份证号、生日未做强一至，可根据身份证号计算一致数据</li></ul></li><li>使用数据字典表+随机函数的方式，生成随机数据</li><li>创建数据表DATA_BIGDATA 批量生成随机数据\\</li><li>数据见：data目录</li></ul><h3 id="字典表" tabindex="-1"><a class="header-anchor" href="#字典表" aria-hidden="true">#</a> 字典表</h3><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token comment">-- 数据字典表</span>
<span class="token keyword">create</span> <span class="token keyword">table</span> DATA_CODE<span class="token punctuation">(</span>
    <span class="token keyword">type</span> <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">50</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    VAL <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    VAl_2 <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    VAL_3 <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">-- 省市区街道</span>
<span class="token keyword">create</span> <span class="token keyword">table</span> DATA_ZONE
    <span class="token punctuation">(</span>
        ID            <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">20</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        PID           <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">20</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        DEEP          <span class="token keyword">INT</span><span class="token punctuation">,</span>
        NAME          <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        PINYIN_PREFIX <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        PINYIN        <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        EXT_ID        <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">50</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        EXT_NAME      <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">200</span><span class="token punctuation">)</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="随机函数-oracle" tabindex="-1"><a class="header-anchor" href="#随机函数-oracle" aria-hidden="true">#</a> 随机函数-oracle</h3><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token comment">-- 随机指定类型下的码值: codeType-码值类型</span>
<span class="token keyword">create</span> <span class="token operator">or</span> <span class="token keyword">replace</span> <span class="token keyword">function</span> randomCodeValue<span class="token punctuation">(</span>codeType <span class="token operator">in</span> varchar2<span class="token punctuation">)</span>
    <span class="token keyword">return</span> <span class="token keyword">varchar</span>
    <span class="token operator">is</span>
    n3 <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">begin</span>
    <span class="token keyword">select</span> val <span class="token keyword">into</span> n3 <span class="token keyword">from</span> DATA_CODE <span class="token keyword">where</span> <span class="token keyword">TYPE</span> <span class="token operator">=</span> codeType <span class="token keyword">order</span> <span class="token keyword">by</span> dbms_random<span class="token punctuation">.</span><span class="token keyword">value</span> <span class="token keyword">FETCH</span> <span class="token keyword">FIRST</span> <span class="token number">1</span> <span class="token keyword">ROWS</span> ONLY<span class="token punctuation">;</span>
    <span class="token keyword">return</span> n3<span class="token punctuation">;</span>
<span class="token keyword">end</span><span class="token punctuation">;</span>

<span class="token comment">-- 随机获取姓名： 姓+名</span>
<span class="token keyword">create</span> <span class="token operator">or</span> <span class="token keyword">replace</span> <span class="token keyword">function</span> randomName<span class="token punctuation">(</span>n1 <span class="token operator">in</span> number<span class="token punctuation">)</span>
    <span class="token keyword">return</span> <span class="token keyword">varchar</span>
    <span class="token operator">is</span>
    n2 <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    n3 <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">begin</span>
    <span class="token keyword">select</span> val <span class="token keyword">into</span> n2 <span class="token keyword">from</span> DATA_CODE <span class="token keyword">where</span> <span class="token keyword">type</span> <span class="token operator">=</span> <span class="token string">&#39;姓&#39;</span> <span class="token keyword">ORDER</span> <span class="token keyword">BY</span> dbms_random<span class="token punctuation">.</span><span class="token keyword">value</span> <span class="token keyword">FETCH</span> <span class="token keyword">FIRST</span> <span class="token number">1</span> <span class="token keyword">ROWS</span> ONLY<span class="token punctuation">;</span>
    <span class="token keyword">select</span> val <span class="token keyword">into</span> n3 <span class="token keyword">from</span> DATA_CODE <span class="token keyword">where</span> <span class="token keyword">type</span> <span class="token operator">=</span> <span class="token string">&#39;名&#39;</span> <span class="token keyword">ORDER</span> <span class="token keyword">BY</span> dbms_random<span class="token punctuation">.</span><span class="token keyword">value</span> <span class="token keyword">FETCH</span> <span class="token keyword">FIRST</span> <span class="token number">1</span> <span class="token keyword">ROWS</span> ONLY<span class="token punctuation">;</span>
    <span class="token keyword">return</span> n2 <span class="token operator">||</span> n3<span class="token punctuation">;</span>
<span class="token keyword">end</span><span class="token punctuation">;</span>

<span class="token comment">-- 随机生成日期字符串：指定日期格式</span>
<span class="token keyword">create</span> <span class="token operator">or</span> <span class="token keyword">replace</span> <span class="token keyword">function</span> randomDateStr<span class="token punctuation">(</span>dataPattern <span class="token operator">in</span> varchar2<span class="token punctuation">)</span>
    <span class="token keyword">return</span> <span class="token keyword">varchar</span>
    <span class="token operator">is</span>
    birthday <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">begin</span>
    <span class="token keyword">select</span> to_char<span class="token punctuation">(</span>to_date<span class="token punctuation">(</span>trunc<span class="token punctuation">(</span>dbms_random<span class="token punctuation">.</span><span class="token keyword">value</span><span class="token punctuation">(</span><span class="token number">2449354</span><span class="token punctuation">,</span><span class="token number">2463186</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span><span class="token string">&#39;J&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">&#39;yyyyMMdd&#39;</span><span class="token punctuation">)</span> <span class="token keyword">into</span> birthday <span class="token keyword">from</span> dual<span class="token punctuation">;</span>
    <span class="token keyword">return</span> birthday<span class="token punctuation">;</span>
<span class="token keyword">end</span><span class="token punctuation">;</span>

<span class="token comment">-- 随机获取表中字段的值：参数1-表名 参数2-字段</span>
<span class="token keyword">create</span> <span class="token operator">or</span> <span class="token keyword">replace</span> <span class="token keyword">function</span> randomTableValue<span class="token punctuation">(</span>tableName <span class="token operator">in</span> varchar2<span class="token punctuation">,</span> colName <span class="token operator">in</span> <span class="token keyword">varchar</span><span class="token punctuation">)</span>
    <span class="token keyword">return</span> <span class="token keyword">varchar</span> <span class="token operator">is</span> returnValue <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    v_sql varchar2<span class="token punctuation">(</span><span class="token number">500</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">begin</span>
    v_sql :<span class="token operator">=</span> <span class="token string">&#39;select &#39;</span><span class="token operator">||</span> colName <span class="token operator">||</span> <span class="token string">&#39; from &#39;</span><span class="token operator">||</span> tablename <span class="token operator">||</span><span class="token string">&#39; ORDER BY dbms_random.value FETCH FIRST 1 ROWS ONLY&#39;</span><span class="token punctuation">;</span>
    <span class="token keyword">execute</span> immediate v_sql <span class="token keyword">into</span> returnValue<span class="token punctuation">;</span>
    <span class="token keyword">return</span> returnValue<span class="token punctuation">;</span>
<span class="token keyword">end</span><span class="token punctuation">;</span>

<span class="token comment">-- 随机生成手机号</span>
<span class="token keyword">create</span> <span class="token operator">or</span> <span class="token keyword">replace</span> <span class="token keyword">function</span> randomCellPhoneNo
    <span class="token keyword">return</span> <span class="token keyword">varchar</span>
    <span class="token operator">is</span>
    returnValue <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">begin</span>
    <span class="token keyword">select</span> trunc<span class="token punctuation">(</span>DBMS_RANDOM<span class="token punctuation">.</span><span class="token keyword">VALUE</span><span class="token punctuation">(</span><span class="token number">13000000000</span><span class="token punctuation">,</span><span class="token number">19000000000</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token keyword">into</span> returnValue <span class="token keyword">from</span> dual<span class="token punctuation">;</span>
    <span class="token keyword">return</span> returnValue<span class="token punctuation">;</span>
<span class="token keyword">end</span><span class="token punctuation">;</span>

<span class="token comment">-- 获取籍贯： 根据num获取籍贯，相同num得到相同籍贯</span>
<span class="token keyword">create</span> <span class="token keyword">function</span> randomJiGuan<span class="token punctuation">(</span>num number<span class="token punctuation">)</span>
    <span class="token keyword">return</span> <span class="token keyword">varchar</span> <span class="token operator">is</span> returnValue <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    TOTAL <span class="token keyword">int</span><span class="token punctuation">;</span>
    IND <span class="token keyword">int</span><span class="token punctuation">;</span>
<span class="token keyword">begin</span>
    <span class="token comment">-- 获取总数</span>
    <span class="token keyword">select</span> <span class="token function">count</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token keyword">into</span> TOTAL
    <span class="token keyword">from</span> DATA_ZONE D <span class="token keyword">left</span> <span class="token keyword">join</span>
         DATA_ZONE P <span class="token keyword">on</span> d<span class="token punctuation">.</span>PID <span class="token operator">=</span> p<span class="token punctuation">.</span>ID
    <span class="token keyword">where</span> D<span class="token punctuation">.</span>deep <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token comment">-- 计算偏移</span>
    <span class="token keyword">select</span> <span class="token function">mod</span><span class="token punctuation">(</span>num<span class="token punctuation">,</span>TOTAL<span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token keyword">into</span> IND <span class="token keyword">from</span> dual<span class="token punctuation">;</span>

    <span class="token keyword">select</span> 籍贯 <span class="token keyword">into</span> returnValue <span class="token keyword">from</span> <span class="token punctuation">(</span>
                <span class="token keyword">select</span> ROWNUM RN<span class="token punctuation">,</span><span class="token keyword">case</span> <span class="token keyword">when</span>  P<span class="token punctuation">.</span>NAME <span class="token operator">=</span> D<span class="token punctuation">.</span>name <span class="token keyword">then</span> P<span class="token punctuation">.</span>NAME <span class="token keyword">else</span>  P<span class="token punctuation">.</span>NAME <span class="token operator">||</span> <span class="token string">&#39;&#39;</span> <span class="token operator">||</span> D<span class="token punctuation">.</span>NAME <span class="token keyword">end</span> <span class="token keyword">as</span> 籍贯
                <span class="token keyword">from</span> DATA_ZONE D <span class="token keyword">left</span> <span class="token keyword">join</span>
                     DATA_ZONE P <span class="token keyword">on</span> d<span class="token punctuation">.</span>PID <span class="token operator">=</span> p<span class="token punctuation">.</span>ID
                <span class="token keyword">where</span> D<span class="token punctuation">.</span>deep <span class="token operator">=</span> <span class="token number">1</span>
                <span class="token keyword">order</span> <span class="token keyword">by</span> D<span class="token punctuation">.</span>id
            <span class="token punctuation">)</span> <span class="token keyword">where</span> RN <span class="token operator">=</span> IND<span class="token punctuation">;</span>

    <span class="token keyword">return</span> returnValue<span class="token punctuation">;</span>
<span class="token keyword">end</span><span class="token punctuation">;</span>

<span class="token comment">-- 获取地址：根据num获取地址，相同num获取的籍贯与地址相对应</span>
<span class="token keyword">create</span> <span class="token operator">or</span> <span class="token keyword">replace</span> <span class="token keyword">function</span> randomAddress<span class="token punctuation">(</span>num number<span class="token punctuation">)</span>
    <span class="token keyword">return</span> <span class="token keyword">varchar</span> <span class="token operator">is</span> returnValue <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    TOTAL <span class="token keyword">int</span><span class="token punctuation">;</span>
    IND <span class="token keyword">int</span><span class="token punctuation">;</span>
    CITY <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    STREET <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">begin</span>
    <span class="token comment">-- 获取总数</span>
    <span class="token keyword">select</span> <span class="token function">count</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token keyword">into</span> TOTAL
    <span class="token keyword">from</span> DATA_ZONE D <span class="token keyword">left</span> <span class="token keyword">join</span>
         DATA_ZONE P <span class="token keyword">on</span> d<span class="token punctuation">.</span>PID <span class="token operator">=</span> p<span class="token punctuation">.</span>ID
    <span class="token keyword">where</span> D<span class="token punctuation">.</span>deep <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token comment">-- 计算偏移</span>
    <span class="token keyword">select</span> <span class="token function">mod</span><span class="token punctuation">(</span>num<span class="token punctuation">,</span>TOTAL<span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token keyword">into</span> IND <span class="token keyword">from</span> dual<span class="token punctuation">;</span>
    <span class="token comment">-- 获取地市</span>
    <span class="token keyword">select</span> ID <span class="token keyword">into</span> CITY <span class="token keyword">from</span> <span class="token punctuation">(</span>
                <span class="token keyword">select</span> ROWNUM RN<span class="token punctuation">,</span> D<span class="token punctuation">.</span>ID<span class="token punctuation">,</span>D<span class="token punctuation">.</span>NAME
                <span class="token keyword">from</span> DATA_ZONE D <span class="token keyword">left</span> <span class="token keyword">join</span>
                     DATA_ZONE P <span class="token keyword">on</span> d<span class="token punctuation">.</span>PID <span class="token operator">=</span> p<span class="token punctuation">.</span>ID
                <span class="token keyword">where</span> D<span class="token punctuation">.</span>deep <span class="token operator">=</span> <span class="token number">1</span>
                <span class="token keyword">order</span> <span class="token keyword">by</span> D<span class="token punctuation">.</span>id
            <span class="token punctuation">)</span> <span class="token keyword">where</span> RN <span class="token operator">=</span> IND<span class="token punctuation">;</span>

    <span class="token comment">-- 随机获取街道</span>
   <span class="token comment">-- select ID into STREET from DATA_ZONE where id like CITY || &#39;%&#39; and deep = &#39;3&#39; ORDER BY dbms_random.value FETCH FIRST 1 ROWS ONLY;</span>
    <span class="token keyword">select</span> ID <span class="token keyword">into</span> STREET <span class="token keyword">from</span> <span class="token punctuation">(</span>
       <span class="token keyword">select</span> <span class="token operator">*</span> <span class="token keyword">from</span> DATA_ZONE D
       <span class="token keyword">start</span> <span class="token keyword">with</span> D<span class="token punctuation">.</span>PID <span class="token operator">=</span>  CITY
       <span class="token keyword">connect</span> <span class="token keyword">by</span> prior id <span class="token operator">=</span> pid
   <span class="token punctuation">)</span> <span class="token keyword">where</span> deep <span class="token operator">=</span> <span class="token number">3</span> <span class="token keyword">ORDER</span> <span class="token keyword">BY</span> dbms_random<span class="token punctuation">.</span><span class="token keyword">value</span> <span class="token keyword">FETCH</span> <span class="token keyword">FIRST</span> <span class="token number">1</span> <span class="token keyword">ROWS</span> ONLY<span class="token punctuation">;</span>

    <span class="token comment">-- 获取城市下的街道地址信息</span>
    <span class="token keyword">select</span> listagg<span class="token punctuation">(</span>EXT_NAME<span class="token punctuation">,</span> <span class="token string">&#39;&#39;</span><span class="token punctuation">)</span> <span class="token keyword">within</span> <span class="token keyword">group</span> <span class="token punctuation">(</span><span class="token keyword">order</span> <span class="token keyword">by</span> deep<span class="token punctuation">)</span> <span class="token operator">||</span>  trunc<span class="token punctuation">(</span>DBMS_RANDOM<span class="token punctuation">.</span><span class="token keyword">VALUE</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span><span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">)</span>  <span class="token operator">||</span> <span class="token string">&#39;号&#39;</span> <span class="token keyword">into</span> returnValue
    <span class="token keyword">from</span>  <span class="token punctuation">(</span>
              <span class="token keyword">select</span> <span class="token keyword">distinct</span> EXT_NAME<span class="token punctuation">,</span> <span class="token function">max</span><span class="token punctuation">(</span>deep<span class="token punctuation">)</span> deep
              <span class="token keyword">from</span> DATA_ZONE D
              <span class="token keyword">start</span> <span class="token keyword">with</span> id <span class="token operator">=</span> STREET
              <span class="token keyword">connect</span> <span class="token keyword">by</span> prior  pid <span class="token operator">=</span>  id
              <span class="token keyword">group</span> <span class="token keyword">by</span> EXT_NAME
          <span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> returnValue<span class="token punctuation">;</span>
<span class="token keyword">end</span><span class="token punctuation">;</span>

<span class="token comment">-- 获取身份证号： 相同Num获取的籍贯、地址对应</span>
<span class="token keyword">create</span> <span class="token operator">or</span> <span class="token keyword">replace</span> <span class="token keyword">function</span> randomCreditNum<span class="token punctuation">(</span>num number<span class="token punctuation">)</span>
    <span class="token keyword">return</span> <span class="token keyword">varchar</span> <span class="token operator">is</span> returnValue <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    TOTAL <span class="token keyword">int</span><span class="token punctuation">;</span>
    IND <span class="token keyword">int</span><span class="token punctuation">;</span>
    CITY <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">begin</span>
    <span class="token comment">-- 获取总数</span>
    <span class="token keyword">select</span> <span class="token function">count</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token keyword">into</span> TOTAL
    <span class="token keyword">from</span> DATA_ZONE D <span class="token keyword">left</span> <span class="token keyword">join</span>
         DATA_ZONE P <span class="token keyword">on</span> d<span class="token punctuation">.</span>PID <span class="token operator">=</span> p<span class="token punctuation">.</span>ID
    <span class="token keyword">where</span> D<span class="token punctuation">.</span>deep <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token comment">-- 计算偏移</span>
    <span class="token keyword">select</span> <span class="token function">mod</span><span class="token punctuation">(</span>num<span class="token punctuation">,</span>TOTAL<span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token keyword">into</span> IND <span class="token keyword">from</span> dual<span class="token punctuation">;</span>

    <span class="token comment">-- 获取地市</span>
    <span class="token keyword">select</span> ID <span class="token keyword">into</span> CITY
    <span class="token keyword">from</span> <span class="token punctuation">(</span>
         <span class="token keyword">select</span> ROWNUM RN<span class="token punctuation">,</span> D<span class="token punctuation">.</span>ID<span class="token punctuation">,</span>D<span class="token punctuation">.</span>NAME
         <span class="token keyword">from</span> DATA_ZONE D <span class="token keyword">left</span> <span class="token keyword">join</span> DATA_ZONE P <span class="token keyword">on</span> d<span class="token punctuation">.</span>PID <span class="token operator">=</span> p<span class="token punctuation">.</span>ID
         <span class="token keyword">where</span> D<span class="token punctuation">.</span>deep <span class="token operator">=</span> <span class="token number">1</span>
         <span class="token keyword">order</span> <span class="token keyword">by</span> D<span class="token punctuation">.</span>id
     <span class="token punctuation">)</span> <span class="token keyword">where</span> RN <span class="token operator">=</span> IND<span class="token punctuation">;</span>

    <span class="token comment">-- 随机身份证</span>
    <span class="token keyword">select</span> ID <span class="token operator">||</span> RANDOMDATESTR<span class="token punctuation">(</span><span class="token string">&#39;yyyyMMdd&#39;</span><span class="token punctuation">)</span> <span class="token operator">||</span> trunc<span class="token punctuation">(</span>DBMS_RANDOM<span class="token punctuation">.</span><span class="token keyword">VALUE</span><span class="token punctuation">(</span><span class="token number">1000</span><span class="token punctuation">,</span><span class="token number">9999</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token keyword">into</span> returnValue <span class="token keyword">from</span> DATA_ZONE <span class="token keyword">where</span> PID <span class="token operator">=</span> CITY <span class="token keyword">ORDER</span> <span class="token keyword">BY</span> dbms_random<span class="token punctuation">.</span><span class="token keyword">value</span> <span class="token keyword">FETCH</span> <span class="token keyword">FIRST</span> <span class="token number">1</span> <span class="token keyword">ROWS</span> ONLY<span class="token punctuation">;</span>
    <span class="token keyword">return</span> returnValue<span class="token punctuation">;</span>
<span class="token keyword">end</span><span class="token punctuation">;</span>

<span class="token keyword">select</span> randomName<span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>
     <span class="token punctuation">,</span> randomCodeValue<span class="token punctuation">(</span><span class="token string">&#39;历史人名&#39;</span><span class="token punctuation">)</span>
     <span class="token punctuation">,</span> randomDateStr<span class="token punctuation">(</span><span class="token string">&#39;yyyyMMdd&#39;</span><span class="token punctuation">)</span>
     <span class="token punctuation">,</span> randomTableValue<span class="token punctuation">(</span><span class="token string">&#39;DATA_CODE&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;val&#39;</span><span class="token punctuation">)</span>
     <span class="token punctuation">,</span> randomCellPhoneNo
     <span class="token punctuation">,</span> randomJiGuan<span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">,</span> randomAddress<span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">,</span> randomCreditNum<span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>
     <span class="token punctuation">,</span> randomJiGuan<span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">,</span> randomAddress<span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">,</span> randomCreditNum<span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span>
     <span class="token punctuation">,</span> randomJiGuan<span class="token punctuation">(</span><span class="token number">21</span><span class="token punctuation">)</span><span class="token punctuation">,</span> randomAddress<span class="token punctuation">(</span><span class="token number">21</span><span class="token punctuation">)</span><span class="token punctuation">,</span> randomCreditNum<span class="token punctuation">(</span><span class="token number">21</span><span class="token punctuation">)</span>
     <span class="token punctuation">,</span> randomJiGuan<span class="token punctuation">(</span><span class="token number">11</span><span class="token punctuation">)</span><span class="token punctuation">,</span> randomAddress<span class="token punctuation">(</span><span class="token number">11</span><span class="token punctuation">)</span><span class="token punctuation">,</span> randomCreditNum<span class="token punctuation">(</span><span class="token number">11</span><span class="token punctuation">)</span>
     <span class="token punctuation">,</span> randomJiGuan<span class="token punctuation">(</span><span class="token number">31</span><span class="token punctuation">)</span><span class="token punctuation">,</span> randomAddress<span class="token punctuation">(</span><span class="token number">31</span><span class="token punctuation">)</span><span class="token punctuation">,</span> randomCreditNum<span class="token punctuation">(</span><span class="token number">31</span><span class="token punctuation">)</span>
<span class="token keyword">from</span> dual<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="随机函数-mysql" tabindex="-1"><a class="header-anchor" href="#随机函数-mysql" aria-hidden="true">#</a> 随机函数-mysql</h3><div class="language-mysql line-numbers-mode" data-ext="mysql"><pre class="language-mysql"><code>-- 随机指定类型下的码值: codeType-码值类型
drop function if exists  randomCodeValue;
DELIMITER $
create function randomCodeValue(codeType varchar(50)) returns varchar(100)
    language sql
    deterministic
    contains sql
    sql security definer
    comment &#39;&#39;
begin
    declare returnValue varchar(100);
    set returnValue = &#39;1&#39;;
    select val into returnValue from DATA_CODE where TYPE = codeType order by RAND() limit 1;
    return returnValue;
end;$
delimiter ;

-- 随机获取姓名： 姓+名
drop function if exists  randomName;
DELIMITER $
create function randomName(n1 int) returns varchar(100)
    language sql
    deterministic
    contains sql
    sql security definer
    comment &#39;&#39;
begin
    declare n1 varchar(100);
    declare n2 varchar(100);
    select val into n1 from DATA_CODE where TYPE = &#39;姓&#39; order by RAND() limit 1;
    select val into n2 from DATA_CODE where TYPE = &#39;名&#39; order by RAND() limit 1;
    return CONCAT(n1, n2);
end;$
delimiter ;

-- 随机日期： days 多少天后  datePattern 格式化
drop function if exists  randomDateStr;
DELIMITER $
create function randomDateStr(days int, datePattern varchar(20)) returns varchar(100)
    language sql
    deterministic
    contains sql
    sql security definer
    comment &#39;&#39;
begin
    declare returnValue varchar(100);
    select date_format(adddate(now(), interval floor(rand() * days) day), datePattern) into returnValue;
    return returnValue;
end;$
delimiter ;


-- 随机时间： second 多少秒后  datePattern 格式化
drop function if exists  randomTimeStr;
DELIMITER $
create function randomTimeStr(second int, datePattern varchar(20)) returns varchar(100)
    language sql
    deterministic
    contains sql
    sql security definer
    comment &#39;&#39;
begin
    declare returnValue varchar(100);
    select date_format(adddate(now(), interval floor(rand() * second) second), datePattern) into returnValue;
    return returnValue;
end;$
delimiter ;

-- 随机日期时间：random 多少天后  datePattern 格式化
drop function if exists  randomDateTime;
DELIMITER $
create function  randomDateTime(random int, datePattern varchar(20)) returns varchar(100)
    language sql
    deterministic
    contains sql
    sql security definer
    comment &#39;&#39;
begin
    declare returnValue varchar(100);
    select concat(randomDateStr(random, &#39;%Y-%m-%d&#39;), &#39; &#39; ,randomTimeStr(86400, &#39;%H:%i:%s&#39;)) into returnValue;
    select date_format(returnValue, datePattern) into returnValue;
    return returnValue;
end;$
delimiter ;


select concat(randomDateStr(-100, &#39;%Y-%m-%d&#39;), &#39; &#39; ,randomTimeStr(86400, &#39;%H:%i:%s&#39;));
select now(), randomDateStr(-100, &#39;%Y-%m-%d&#39;) 100天之内, randomDateStr(100, &#39;%Y-%m-%d&#39;) 100天之后,
    adddate(now(), interval 100 second ) 100秒后, randomTimeStr(-100, &#39;%H:%i:%s&#39;) 100秒前,randomTimeStr(100, &#39;%H:%i:%s&#39;) 100秒后
, randomDateTime(-100, &#39;%Y-%m-%d %H:%i:%s&#39;) 随机日期时间
;

-- 随机生成手机号
drop function if exists  randomCellPhoneNo;
DELIMITER $
create function randomCellPhoneNo() returns varchar(100)
    language sql
    deterministic
    contains sql
    sql security definer
    comment &#39;&#39;
begin
    declare returnValue varchar(100);
    select floor(13000000000 + rand() * 6000000000) into returnValue from dual;
    return returnValue;
end;$
delimiter ;

-- 获取籍贯： 根据num获取籍贯，相同num得到相同籍贯
drop function if exists  randomJiGuan;
DELIMITER $
create function randomJiGuan(num int) returns varchar(100)
    language sql
    deterministic
    contains sql
    sql security definer
    comment &#39;&#39;
begin
    declare returnValue varchar(100);
    declare TOTAL INT;
    declare IND INT;
    -- 获取总数
    select count(1) into TOTAL
    from DATA_ZONE D left join
         DATA_ZONE P on d.PID = p.ID
    where D.deep = 1;
    -- 计算偏移
    select mod(num,TOTAL) + 1 into IND from dual;

    select 籍贯 into returnValue from (
          select row_number() over (order by D.id) RN, D.* , case when  P.NAME = D.name then P.NAME else  CONCAT(P.NAME, D.NAME) end as 籍贯
          from DATA_ZONE D left join
               DATA_ZONE P on d.PID = p.ID
          where D.deep = 1
          order by D.id
      ) T where RN = IND;

    return returnValue;
end;$
delimiter ;

-- 获取地址：根据num获取地址，相同num获取的籍贯与地址相对应
drop function if exists  randomAddress;
DELIMITER $
create function randomAddress(num int) returns varchar(100)
    language sql
    deterministic
    contains sql
    sql security definer
    comment &#39;&#39;
begin
    declare returnValue varchar(100);
    declare CITY varchar(100);
    declare STREET varchar(100);
    declare TOTAL INT;
    declare IND INT;
    -- 获取总数
    select count(1) into TOTAL
    from DATA_ZONE D left join
         DATA_ZONE P on d.PID = p.ID
    where D.deep = 1;
    -- 计算偏移
    select mod(num,TOTAL) + 1 into IND from dual;
    -- 获取地市
    select ID into CITY from (
          select row_number() over (order by D.id) RN,D.ID,D.NAME
          from DATA_ZONE D left join
               DATA_ZONE P on d.PID = p.ID
          where D.deep = 1
          order by D.id
      ) T where RN = IND;

    -- 随机获取街道
    -- select ID into STREET from DATA_ZONE where id like CITY || &#39;%&#39; and deep = &#39;3&#39; ORDER BY dbms_random.value FETCH FIRST 1 ROWS ONLY;
    -- 查询子节点  含自己
    WITH RECURSIVE DATA_ZONE_TREE (id, pid, deep, name, pinyin_prefix, pinyin, ext_id, ext_name) AS
       (
           SELECT T1.id, T1.pid, T1.deep, T1.name, T1.pinyin_prefix, T1.pinyin, T1.ext_id, T1.ext_name
           from DATA_ZONE T1
           where T1.ID = CITY
           UNION ALL
           SELECT T2.id, T2.pid, T2.deep, T2.name, T2.pinyin_prefix, T2.pinyin, T2.ext_id, T2.ext_name
           from DATA_ZONE T2, DATA_ZONE_TREE T3
           WHERE T2.pid = T3.id
       )
    SELECT T.id into STREET FROM DATA_ZONE_TREE T where deep = 3 ORDER BY RAND() limit 1;

    WITH RECURSIVE DATA_ZONE_TREE (id, pid, deep, name, pinyin_prefix, pinyin, ext_id, ext_name) AS
       (
           SELECT T1.id, T1.pid, T1.deep, T1.name, T1.pinyin_prefix, T1.pinyin, T1.ext_id, T1.ext_name
           from DATA_ZONE T1
           where T1.ID = CITY
           UNION ALL
           SELECT T2.id, T2.pid, T2.deep, T2.name, T2.pinyin_prefix, T2.pinyin, T2.ext_id, T2.ext_name
           from DATA_ZONE T2, DATA_ZONE_TREE T3
           WHERE T2.id = T3.pid
       )
    select group_concat(ext_name order by deep separator &#39;&#39;) INTO returnValue
    from ( SELECT distinct ext_name , max(deep) deep FROM DATA_ZONE_TREE T group by ext_name order by deep ) RS order by deep;
    return returnValue;
end;$
delimiter ;

-- 获取身份证号： 相同Num获取的籍贯、地址对应
drop function if exists  randomCreditNum;
DELIMITER $
create function randomCreditNum(num int) returns varchar(100)
    language sql
    deterministic
    contains sql
    sql security definer
    comment &#39;&#39;
begin
    declare returnValue varchar(100);
    declare CITY varchar(100);
    declare STREET varchar(100);
    declare TOTAL INT;
    declare IND INT;
    -- 获取总数
    select count(1) into TOTAL
    from DATA_ZONE D left join
         DATA_ZONE P on d.PID = p.ID
    where D.deep = 1;
    -- 计算偏移
    select mod(num,TOTAL) + 1 into IND from dual;
    -- 获取地市
    select ID into CITY from (
          select row_number() over (order by D.id) RN,D.ID,D.NAME
          from DATA_ZONE D left join
               DATA_ZONE P on d.PID = p.ID
          where D.deep = 1
          order by D.id
      ) T where RN = IND;

     -- 获取身份证
    select  concat(ID,RANDOMDATESTR(-10650, &#39;%Y%m%d&#39;) ,floor(1000 + rand() * 9000)) into returnValue
                   from DATA_ZONE where PID = CITY ORDER BY rand() limit 1;

    return returnValue;
end;$
delimiter ;

select randomName(1)
     , randomCodeValue(&#39;历史人名&#39;)
     , randomDateStr(-1000, &#39;%Y%m%d&#39;)
     , randomCellPhoneNo()
     , randomJiGuan(1), randomAddress(1), randomCreditNum(1)
     , randomJiGuan(2), randomAddress(2), randomCreditNum(2)
     , randomJiGuan(21), randomAddress(21), randomCreditNum(21)
     , randomJiGuan(11), randomAddress(11), randomCreditNum(11)
     , randomJiGuan(31), randomAddress(31), randomCreditNum(31)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="大数据量表-个人信息" tabindex="-1"><a class="header-anchor" href="#大数据量表-个人信息" aria-hidden="true">#</a> 大数据量表-个人信息</h3><ul><li>oracle</li></ul><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token comment">-- 创建一万条信息</span>
<span class="token keyword">CREATE</span> <span class="token keyword">table</span> DATA_BIGDATA <span class="token keyword">as</span> <span class="token punctuation">(</span>
		<span class="token keyword">SELECT</span> ROWNUM <span class="token keyword">AS</span> T_ID<span class="token punctuation">,</span>
           trunc<span class="token punctuation">(</span>DBMS_RANDOM<span class="token punctuation">.</span><span class="token keyword">VALUE</span><span class="token punctuation">(</span><span class="token number">10000000</span><span class="token punctuation">,</span><span class="token number">10999999</span><span class="token punctuation">)</span><span class="token punctuation">)</span> 员工工号<span class="token punctuation">,</span>
           TRUNC<span class="token punctuation">(</span>DBMS_RANDOM<span class="token punctuation">.</span><span class="token keyword">VALUE</span><span class="token punctuation">(</span><span class="token number">23</span><span class="token punctuation">,</span> <span class="token number">65</span><span class="token punctuation">)</span><span class="token punctuation">)</span> 年龄<span class="token punctuation">,</span>
           RANDOMNAME<span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token keyword">AS</span> 姓名<span class="token punctuation">,</span>
           randomCodeValue<span class="token punctuation">(</span><span class="token string">&#39;民族&#39;</span><span class="token punctuation">)</span> <span class="token keyword">AS</span> 民族<span class="token punctuation">,</span>
           randomJiGuan<span class="token punctuation">(</span>ROWNUM<span class="token punctuation">)</span> <span class="token keyword">AS</span> 籍贯<span class="token punctuation">,</span>
           randomAddress<span class="token punctuation">(</span>ROWNUM<span class="token punctuation">)</span> <span class="token keyword">AS</span> 户口所在地<span class="token punctuation">,</span>
           randomAddress<span class="token punctuation">(</span>ROWNUM<span class="token punctuation">)</span> <span class="token keyword">AS</span> 现居地址<span class="token punctuation">,</span>
           randomCodeValue<span class="token punctuation">(</span><span class="token string">&#39;职业&#39;</span><span class="token punctuation">)</span> <span class="token keyword">AS</span> 职务<span class="token punctuation">,</span>
           randomCodeValue<span class="token punctuation">(</span><span class="token string">&#39;部门&#39;</span><span class="token punctuation">)</span> <span class="token keyword">AS</span> 部门<span class="token punctuation">,</span>
           randomCodeValue<span class="token punctuation">(</span><span class="token string">&#39;学历&#39;</span><span class="token punctuation">)</span> <span class="token keyword">AS</span> 最高学历<span class="token punctuation">,</span>
           RANDOMCELLPHONENO<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">as</span> 联系电话<span class="token punctuation">,</span>
           DBMS_RANDOM<span class="token punctuation">.</span>STRING<span class="token punctuation">(</span><span class="token number">4</span><span class="token punctuation">,</span><span class="token number">6</span><span class="token punctuation">)</span> <span class="token operator">||</span> <span class="token string">&#39;@163.com&#39;</span>  邮箱<span class="token punctuation">,</span>
           trunc<span class="token punctuation">(</span>DBMS_RANDOM<span class="token punctuation">.</span><span class="token keyword">VALUE</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token number">5</span><span class="token punctuation">)</span> <span class="token punctuation">)</span> <span class="token keyword">as</span> 婚姻状况<span class="token punctuation">,</span>
           randomCodeValue<span class="token punctuation">(</span><span class="token string">&#39;大学&#39;</span><span class="token punctuation">)</span> <span class="token keyword">AS</span> 毕业院校<span class="token punctuation">,</span>
           to_char<span class="token punctuation">(</span>sysdate<span class="token operator">-</span>TRUNC<span class="token punctuation">(</span>DBMS_RANDOM<span class="token punctuation">.</span><span class="token keyword">VALUE</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token number">1000000000</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token operator">/</span><span class="token number">24</span><span class="token operator">/</span><span class="token number">60</span><span class="token operator">/</span><span class="token number">60</span><span class="token punctuation">,</span><span class="token string">&#39;yyyy-mm-dd hh24:mi:ss&#39;</span><span class="token punctuation">)</span> 时间<span class="token punctuation">,</span>
           to_char<span class="token punctuation">(</span>sysdate<span class="token operator">-</span>TRUNC<span class="token punctuation">(</span>DBMS_RANDOM<span class="token punctuation">.</span><span class="token keyword">VALUE</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token number">1000000000</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token operator">/</span><span class="token number">24</span><span class="token operator">/</span><span class="token number">60</span><span class="token operator">/</span><span class="token number">60</span><span class="token punctuation">,</span><span class="token string">&#39;yyyy-mm-dd&#39;</span><span class="token punctuation">)</span> 生日<span class="token punctuation">,</span>
           randomCreditNum<span class="token punctuation">(</span>ROWNUM<span class="token punctuation">)</span>  身份证号码
    <span class="token keyword">FROM</span> DUAL
<span class="token keyword">CONNECT</span> <span class="token keyword">BY</span> <span class="token keyword">LEVEL</span> <span class="token operator">&lt;=</span> <span class="token number">10000</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><p>mysql</p><div class="language-mysql line-numbers-mode" data-ext="mysql"><pre class="language-mysql"><code>SELECT
    T_ID AS T_ID,
       FLOOR(10 + RAND() * 80) 年龄,
       RANDOMNAME(1) AS 姓名,
       randomCodeValue(&#39;民族&#39;) AS 民族,
       randomJiGuan(T_ID) AS 籍贯,
       randomAddress(T_ID) AS 户口所在地,
       randomAddress(T_ID) AS 现居地址,
       randomCodeValue(&#39;职业&#39;) AS 职务,
       randomCodeValue(&#39;部门&#39;) AS 部门,
       randomCodeValue(&#39;学历&#39;) AS 最高学历,
       RANDOMCELLPHONENO() as 联系电话,
       CONCAT(substring(md5(rand()), 1, 10) , &#39;@163.com&#39;)  邮箱,
       FLOOR(0 + RAND() * 1) as 婚姻状况,
       randomCodeValue(&#39;大学&#39;) AS 毕业院校,
       randomDateStr(-100000, &#39;%Y-%m-%d&#39;) 生日,
       randomDateTime(-100000, &#39;%Y-%m-%d %H:%i:%s&#39;) 生日,
       randomCreditNum(1)  身份证号码
from ( select FLOOR(10000000 + RAND() * 999999) T_ID ) RS
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul>`,15),i=[t];function l(o,c){return s(),a("div",null,i)}const d=n(p,[["render",l],["__file","造数及脱敏方法.html.vue"]]);export{d as default};
