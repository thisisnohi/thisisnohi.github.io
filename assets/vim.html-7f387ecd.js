import{_ as i,p as l,q as a,a1 as e}from"./framework-449724a9.js";const t={},p=e('<h1 id="vim" tabindex="-1"><a class="header-anchor" href="#vim" aria-hidden="true">#</a> vim</h1><blockquote><p>create by nohi 20191211</p><p>https://www.toutiao.com/a6768939994401735181/?tt_from=copy_link&amp;utm_campaign=client_share&amp;timestamp=1576024660&amp;app=news_article&amp;utm_source=copy_link&amp;utm_medium=toutiao_ios&amp;req_id=2019121108374001002302815409BDEF42&amp;group_id=6768939994401735181</p></blockquote><h3 id="移动光标" tabindex="-1"><a class="header-anchor" href="#移动光标" aria-hidden="true">#</a> 移动光标</h3><ul><li><p>Kjlh 上下左右 n+kjlh 上下n行、n字符</p></li><li><p>w 右移字首</p></li><li><p>b 左移字首</p></li><li><p>e 右移字尾</p></li><li><p>() {} 句首、句尾 （使用时是文章头、文章尾）</p></li><li><p><strong>0 行首 $ 行尾</strong></p></li><li><p>gg 第一行 G 最后一行</p></li><li><p>H M L 移至当前屏幕 头、中间、尾行</p></li></ul><h3 id="屏幕滚动" tabindex="-1"><a class="header-anchor" href="#屏幕滚动" aria-hidden="true">#</a> 屏幕滚动</h3><ul><li>ctrl+u 向上半屏</li><li>ctrl+d 向下半屏</li><li>ctrl+f 向下一屏</li><li>ctrl+b 向上一屏</li><li>nz 第nt行至屏幕顶部，不指定n，当前行至屏幕顶部</li></ul><h3 id="搜索及替换" tabindex="-1"><a class="header-anchor" href="#搜索及替换" aria-hidden="true">#</a> 搜索及替换</h3><ul><li>/pattern 从光标开始处向文件尾搜索</li><li>?pattern 从光标开始处向文件首搜索pattern</li><li>n 重复上一次搜索命令</li><li>N 反方向重复上一次搜索命令</li><li>😒/p1/p2/g 将当前行中所有p1均替换为p2, g表示执行 c表示需要确认</li><li>:n1,n2 s/p1/p2/g</li><li>:g/p1/s//p2/g === :%s/vivian/sky/g 将文件中所有p1替换为p2</li></ul><h3 id="编辑" tabindex="-1"><a class="header-anchor" href="#编辑" aria-hidden="true">#</a> 编辑</h3><ul><li>CW/DW 删除单词</li></ul>',10),r=[p];function n(c,h){return l(),a("div",null,r)}const d=i(t,[["render",n],["__file","vim.html.vue"]]);export{d as default};
