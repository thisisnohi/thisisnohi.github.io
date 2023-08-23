import{_ as a,p as l,q as e,a1 as i}from"./framework-449724a9.js";const s={},c=i('<h1 id="_21-class文件结构" tabindex="-1"><a class="header-anchor" href="#_21-class文件结构" aria-hidden="true">#</a> 21 Class文件结构</h1><h2 id="_1-解读class文件方式" tabindex="-1"><a class="header-anchor" href="#_1-解读class文件方式" aria-hidden="true">#</a> 1 解读class文件方式</h2><ul><li>Notepad++，安装HEX-Editor插件，或者用Binary Viewer</li><li>javap(jdk自带反解析工具)</li><li>使用IDEA插件，jclasslib 或者 jclasslib bytecode viewer客户端工具</li></ul><h2 id="_4-常用命令" tabindex="-1"><a class="header-anchor" href="#_4-常用命令" aria-hidden="true">#</a> 4 常用命令</h2><ul><li><p>javac -g 生成局部变量表信息</p></li><li><p><code>javap &lt;options&gt; &lt;classes&gt;</code></p><ul><li><p>javap --help 帮助</p></li><li><p>javap -version 当前javap所在jdk的版本信息，与class文件无关</p></li><li><p>javap -s 输出内部类型签名</p></li><li><p>java -l 输出行号和本地变量表</p></li><li><p>javac -c 对代码进行反汇编</p></li><li><p>java -v -verbose 输出附加信息（包括行号、本地变量表、反汇编等详细信息）</p></li></ul></li></ul>',5),t=[c];function r(p,d){return l(),e("div",null,t)}const o=a(s,[["render",r],["__file","21_Class文件结构.html.vue"]]);export{o as default};
