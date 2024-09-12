import{_ as e,p as i,q as d,a1 as a}from"./framework-613df08c.js";const n={},l=a(`<h1 id="excel" tabindex="-1"><a class="header-anchor" href="#excel" aria-hidden="true">#</a> Excel</h1><blockquote><p>create by nohi 20240716</p></blockquote><h2 id="快捷键" tabindex="-1"><a class="header-anchor" href="#快捷键" aria-hidden="true">#</a> 快捷键</h2><h2 id="公式、函数" tabindex="-1"><a class="header-anchor" href="#公式、函数" aria-hidden="true">#</a> 公式、函数</h2><h3 id="常用" tabindex="-1"><a class="header-anchor" href="#常用" aria-hidden="true">#</a> 常用</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>ROW() : 获取单元格行索引
COLUMN(): 获取单元格列索引
ADDRESS(1,2,1)： 获取第一行、第二列，单元格的字母表达方式，$B$2。第三个参数：1-绝对行和列(默认) 2-绝对行/相对列 3-绝对列/相对行 4-相对行和列
配合：INDIRECT 可能获取对应行列的单元格值
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><p><code>VLOOKUP</code></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>查找
参数1：X19 要查找匹配的值
参数2：$S$25:$T$28: 为查找的区域，可能A:B ,即A列和B列
参数3：取值为参数2区域的第2列
参数4：0 精确匹配
=VLOOKUP(X19,$S$25:$T$28, 2,0)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><code>SUMIF(A:A, F11, B:B)</code></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>第一个参数：查询范围A:A列，
第二个参数：匹配条件
第三个参数: 统计的值范围
如果A:A改为 A2:A20 则第三个参数也得改成对应的范围，如B2:B20
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><code>SUMIFS</code></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>=SUMIFS(求和范围, 条件范围1, 条件1, 条件范围2, 条件2, ...)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li><li><p><code>=COUNTIFS()</code></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>COUNTIFS既能解决多个条件的计数，也能解决单个条件的计数，而COUNTIF函数只能解决单个条件的计数，所以，我们一般只需要掌握COUNTIFS函数就可以了。
=COUNTIFS(条件匹配查询区域1，条件1，条件匹配查询区域2，条件2，以此类推......）
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><code>XLOOKUP</code></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>XLOOKUP 在 Excel 2016 和 Excel 2019 中不可用

=XLOOKUP( F2 &amp; G2 &amp; H2 , A2:A13 &amp; B2:B13 &amp; C2:C13 , D2:D13 )
此特定公式将查找范围D2:D13中满足以下条件的单元格：

单元格区域A2:A13中的值等于单元格F2中的值
单元格区域B2:B13中的值等于单元格G2中的值
单元格范围C2:C13中的值等于单元格H2中的值
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><code>=IFNA(VLOOKUP($H26&amp;I$25,$O$3:$T$51,4,0),&quot;&quot;)</code></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>IFNA： 如果表达式为NA，则显示第二个参数内容
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li></ul>`,7),s=[l];function c(r,t){return i(),d("div",null,s)}const u=e(n,[["render",c],["__file","excel.html.vue"]]);export{u as default};
