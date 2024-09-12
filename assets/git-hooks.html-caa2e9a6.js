import{_ as a,p as n,q as s,a1 as e}from"./framework-613df08c.js";const t={},l=e(`<h1 id="git-hooks" tabindex="-1"><a class="header-anchor" href="#git-hooks" aria-hidden="true">#</a> git hooks</h1><h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h2><ul><li>https://www.cnblogs.com/hpcpp/p/7380939.html</li><li>https://www.jianshu.com/p/5531a21afa68</li></ul><h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h2><ul><li><p>mac</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker</span> run <span class="token parameter variable">-d</span>  <span class="token parameter variable">-p</span> <span class="token number">443</span>:443 <span class="token parameter variable">-p</span> <span class="token number">80</span>:80 <span class="token parameter variable">-p</span> <span class="token number">222</span>:22 <span class="token parameter variable">--name</span> gitlab <span class="token parameter variable">--restart</span> always <span class="token parameter variable">-v</span> /home/gitlab/config:/etc/gitlab <span class="token parameter variable">-v</span> /home/gitlab/logs:/var/log/gitlab <span class="token parameter variable">-v</span> /home/gitlab/data:/var/opt/gitlab gitlab/gitlab-ce
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li><li><p>linux</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>docker run -d  -p 10443:443 -p 10080:10080 -p 10022:10022 --name gitlab --restart always -v /home/gitlab/config:/etc/gitlab -v /home/gitlab/logs:/var/log/gitlab -v /home/gitlab/data:/var/opt/gitlab gitlab/gitlab-ce

/home/gitlab/config:/etc/gitlab
/home/gitlab/logs:/var/log/gitlab
/home/gitlab/data:/var/opt/gitlab
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><p><strong>坑</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>10080 访问：strict-origin-when-cross-origin
使用其他商品访问：http://10.0.0.210:82
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="hooks" tabindex="-1"><a class="header-anchor" href="#hooks" aria-hidden="true">#</a> hooks</h2><ul><li><p>参考：https://www.jianshu.com/p/5531a21afa68</p></li><li><p><code>vi /etc/gitlab/gitlab.rb</code></p></li><li><p><code>gitaly[&#39;custom_hooks_dir&#39;] = &quot;/var/opt/gitlab/gitaly/custom_hooks&quot;</code></p></li><li><p>Gitlab - project - setting - general setting 获取 projectid 这里是2</p></li><li><p>echo -n projectid | sha256sum 获取输出</p><ul><li>如： echo -n 2 | sha256sum</li><li>结果： d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35</li><li>路径目录 d4/73/d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35.git</li></ul></li><li><p>cd /var/opt/gitlab/git-data/repositories/@hashed/<code>d4/73/d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35.git</code></p></li><li><p>Customer_hooks/pre-receive.d/01.sh</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># Get custom commit message format
while read OLD_REVISION NEW_REVISION REFNAME ; do
  echo [pre-receive] OLD_REVISION : \${OLD_REVISION}
  echo [pre-receive] NEW_REVISION : \${NEW_REVISION}
  echo [pre-receive] REFNAME      : \${REFNAME}

  export OLD_VALUE=\${OLD_REVISION}
  export NEW_VALUE=\${NEW_REVISION}
done
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>注释</p><ul><li>https://www.cnblogs.com/jiaoshou/p/11190619.html</li><li>标准注释</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>feat： 新增 feature
fix: 修复 bug
docs: 仅仅修改了文档，比如 README, CHANGELOG, CONTRIBUTE等等
style: 仅仅修改了空格、格式缩进、逗号等等，不改变代码逻辑
refactor: 代码重构，没有加新功能或者修复 bug
perf: 优化相关，比如提升性能、体验
test: 测试用例，包括单元测试、集成测试等
chore: 改变构建流程、或者增加依赖库、工具等
revert: 回滚到上一个版本
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><p>注释脚本</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token shebang important">#!/bin/bash</span>

<span class="token function-name function">validate_ref</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token comment"># --- Arguments</span>
    <span class="token assign-left variable">oldrev</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">git</span> rev-parse $1<span class="token variable">)</span></span>
    <span class="token assign-left variable">newrev</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">git</span> rev-parse $2<span class="token variable">)</span></span>
    <span class="token assign-left variable">refname</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">$3</span>&quot;</span>

    <span class="token assign-left variable">commitList</span><span class="token operator">=</span><span class="token variable"><span class="token variable">\`</span><span class="token function">git</span> rev-list $oldrev<span class="token punctuation">..</span>$newrev<span class="token variable">\`</span></span>
    <span class="token builtin class-name">echo</span> <span class="token string">&#39;****************&#39;</span>
    <span class="token builtin class-name">echo</span> <span class="token variable">$commitList</span>
    <span class="token builtin class-name">echo</span> <span class="token string">&#39;****************&#39;</span>
    <span class="token assign-left variable">split</span><span class="token operator">=</span><span class="token punctuation">(</span><span class="token variable">$commitList</span><span class="token punctuation">)</span>
    <span class="token function">rm</span> <span class="token parameter variable">-rf</span> target.txt
    <span class="token keyword">for</span> <span class="token for-or-select variable">s</span> <span class="token keyword">in</span> <span class="token variable">\${split<span class="token punctuation">[</span>@<span class="token punctuation">]</span>}</span>
    <span class="token keyword">do</span>
    <span class="token comment">#echo $s</span>
        <span class="token builtin class-name">echo</span> <span class="token variable">$s</span> <span class="token operator">&gt;&gt;</span>./target.txt
        <span class="token assign-left variable">msg</span><span class="token operator">=</span><span class="token variable"><span class="token variable">\`</span><span class="token function">git</span> cat-file commit $s <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">&#39;1,/^$/d&#39;</span><span class="token variable">\`</span></span>
        <span class="token builtin class-name">echo</span> COMMIT MSG:<span class="token variable">$msg</span>

    <span class="token keyword">done</span>
    <span class="token comment">#python3 scp.py</span>
    <span class="token comment">#cp target.txt /home/gitlab/target.txt</span>
    <span class="token builtin class-name">exit</span> <span class="token number">1</span>

<span class="token punctuation">}</span>

<span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token parameter variable">-n</span> <span class="token string">&quot;<span class="token variable">$1</span>&quot;</span> <span class="token parameter variable">-a</span> <span class="token parameter variable">-n</span> <span class="token string">&quot;<span class="token variable">$2</span>&quot;</span> <span class="token parameter variable">-a</span> <span class="token parameter variable">-n</span> <span class="token string">&quot;<span class="token variable">$3</span>&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span>
    <span class="token builtin class-name">echo</span> <span class="token string">&quot;11111&quot;</span>
    <span class="token assign-left variable">PAGER</span><span class="token operator">=</span> validate_ref <span class="token variable">$2</span> <span class="token variable">$3</span> <span class="token variable">$1</span>
<span class="token keyword">else</span>
    <span class="token builtin class-name">echo</span> <span class="token string">&quot;2222&quot;</span>
    <span class="token keyword">while</span> <span class="token builtin class-name">read</span> oldrev newrev refname
    <span class="token keyword">do</span>
        <span class="token builtin class-name">echo</span> <span class="token string">&quot;before validate_ref oldrev:<span class="token variable">$oldrev</span>&quot;</span>
        validate_ref <span class="token variable">$oldrev</span> <span class="token variable">$newrev</span> <span class="token variable">$refname</span>
    <span class="token keyword">done</span>
<span class="token keyword">fi</span>
<span class="token builtin class-name">echo</span> <span class="token string">&quot;before exit&quot;</span>
<span class="token builtin class-name">exit</span> <span class="token number">1</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul></li></ul><h3 id="客户端githooks" tabindex="-1"><a class="header-anchor" href="#客户端githooks" aria-hidden="true">#</a> 客户端githooks</h3><ul><li><p>Githooks:</p><ul><li>位置：<code>.git/hooks</code></li><li>文件：<code>pre-commit</code>（以sample结尾的为样例文件，不生效）</li></ul></li><li><p>pmd检查(java命令运行)</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>下载代码：<span class="token variable"><span class="token variable">\`</span>https://github.com/alibaba/p3c.git<span class="token variable">\`</span></span>
<span class="token builtin class-name">cd</span> p3c-pmd
mvn clean package

<span class="token comment"># p3c-pmd-2.1.1-jar-with-dependencies.jar 不同版本jar名称不同</span>
<span class="token assign-left variable">pmd_dir</span><span class="token operator">=</span>pmd jar所在目录
<span class="token function">java</span> <span class="token parameter variable">-Dfile.encoding</span><span class="token operator">=</span>utf8 <span class="token parameter variable">-cp</span> <span class="token variable">\${pmd_dir}</span>/p3c-pmd-2.1.1-jar-with-dependencies.jar net.sourceforge.pmd.PMD <span class="token parameter variable">-d</span> ./src/main <span class="token parameter variable">-R</span> <span class="token variable">\${pmd_dir}</span>/ali-p3c.xml <span class="token parameter variable">-f</span> text <span class="token parameter variable">-shortnames</span> -no-cache <span class="token parameter variable">-r</span> <span class="token variable">\${pmd_dir}</span>/report.html  
<span class="token comment">## 参数</span>
<span class="token parameter variable">-d</span> 源码所在目录 
<span class="token parameter variable">-R</span> 规则文件
<span class="token parameter variable">-f</span> 生成结果文件格式: text 为文本
<span class="token parameter variable">-r</span> 生成结果文件目录
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><p>如果不知道参数信息</p><blockquote><p>可通过直接运行pmdjar 得到提示,如下 java -Dfile.encoding=utf8 -cp \${pmd_dir}/p3c-pmd-2.1.1-jar-with-dependencies.jar net.sourceforge.pmd.PMD</p></blockquote></li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>
Usage: pmd <span class="token punctuation">[</span>options<span class="token punctuation">]</span>
  Options:
    -failOnViolation, <span class="token parameter variable">--failOnViolation</span>
      By default PMD exits with status <span class="token number">4</span> <span class="token keyword">if</span> violations are found. Disable this
      option with <span class="token string">&#39;-failOnViolation false&#39;</span> to <span class="token builtin class-name">exit</span> with <span class="token number">0</span> instead and just
      <span class="token function">write</span> the report.
      Default: <span class="token boolean">true</span>
    <span class="token parameter variable">-auxclasspath</span>
      Specifies the classpath <span class="token keyword">for</span> libraries used by the <span class="token builtin class-name">source</span> code. This is
      used by the <span class="token builtin class-name">type</span> resolution. Alternatively, a <span class="token string">&#39;file://&#39;</span> URL to a text
      <span class="token function">file</span> containing path elements on consecutive lines can be specified.
    -benchmark, <span class="token parameter variable">-b</span>
      Benchmark mode - output a benchmark report upon completion<span class="token punctuation">;</span> default to
      System.err.
      Default: <span class="token boolean">false</span>
    <span class="token parameter variable">-cache</span>
      Specify the location of the cache <span class="token function">file</span> <span class="token keyword">for</span> incremental analysis. This
      should be the full path to the file, including the desired <span class="token function">file</span> name
      <span class="token punctuation">(</span>not just the parent directory<span class="token punctuation">)</span>. If the <span class="token function">file</span> doesn<span class="token string">&#39;t exist, it will be
      created on the first run. The file will be overwritten on each run with
      the most up-to-date rule violations.
    -dir, -d
      Root directory for sources.
    -encoding, -e
      Specifies the character set encoding of the source code files PMD is
      reading (i.e., UTF-8).
      Default: UTF-8
    -filelist
      Path to a file containing a list of files to analyze.
    -format, -f
      Report format type.
      Default: text
    -help, -h, -H
      Display help on usage.
    -ignorelist
      Path to a file containing a list of files to ignore.
    -language, -l
      Specify a language PMD should use.
    -minimumpriority, -min
      Rule priority threshold; rules with lower priority than configured here
      won&#39;</span>t be used. Valid values are integers between <span class="token number">1</span> and <span class="token number">5</span> <span class="token punctuation">(</span>inclusive<span class="token punctuation">)</span>,
      with <span class="token number">5</span> being the lowest priority.
      Default: <span class="token number">5</span>
    -no-cache
      Explicitly disable incremental analysis. The <span class="token string">&#39;-cache&#39;</span> option is ignored
      <span class="token keyword">if</span> this switch is present <span class="token keyword">in</span> the <span class="token builtin class-name">command</span> line.
      Default: <span class="token boolean">false</span>
    <span class="token parameter variable">-norulesetcompatibility</span>
      Disable the ruleset compatibility filter. The filter is active by
      default and tries automatically <span class="token string">&#39;fix&#39;</span> old ruleset files with old rule
      names
      Default: <span class="token boolean">false</span>
    -property, <span class="token parameter variable">-P</span>
      <span class="token punctuation">{</span>name<span class="token punctuation">}</span><span class="token operator">=</span><span class="token punctuation">{</span>value<span class="token punctuation">}</span>: Define a property <span class="token keyword">for</span> the report format.
      Default: <span class="token punctuation">[</span><span class="token punctuation">]</span>
    -reportfile, <span class="token parameter variable">-r</span>
      Sends report output to a <span class="token function">file</span><span class="token punctuation">;</span> default to System.out.
  * -rulesets, <span class="token parameter variable">-R</span>
      Comma separated list of ruleset names to use.
    <span class="token parameter variable">-shortnames</span>
      Prints shortened filenames <span class="token keyword">in</span> the report.
      Default: <span class="token boolean">false</span>
    <span class="token parameter variable">-showsuppressed</span>
      Report should show suppressed rule violations.
      Default: <span class="token boolean">false</span>
    -stress, <span class="token parameter variable">-S</span>
      Performs a stress test.
      Default: <span class="token boolean">false</span>
    <span class="token parameter variable">-suppressmarker</span>
      Specifies the string that marks a line <span class="token function">which</span> PMD should ignore<span class="token punctuation">;</span> default
      is NOPMD.
      Default: NOPMD
    -threads, <span class="token parameter variable">-t</span>
      Sets the number of threads used by PMD.
      Default: <span class="token number">1</span>
    -uri, <span class="token parameter variable">-u</span>
      Database URI <span class="token keyword">for</span> sources.
    -debug, -verbose, -D, <span class="token parameter variable">-V</span>
      Debug mode.
      Default: <span class="token boolean">false</span>
    -version, <span class="token parameter variable">-v</span>
      Specify version of a language PMD should use.


Mandatory arguments:
<span class="token number">1</span><span class="token punctuation">)</span> A <span class="token function">java</span> <span class="token builtin class-name">source</span> code filename or directory
<span class="token number">2</span><span class="token punctuation">)</span> A report <span class="token function">format</span>
<span class="token number">3</span><span class="token punctuation">)</span> A ruleset filename or a comma-delimited string of ruleset filenames

For example:
C:<span class="token punctuation">\\</span><span class="token operator">&gt;</span>pmd-bin-6.15.0<span class="token punctuation">\\</span>bin<span class="token punctuation">\\</span>pmd.bat <span class="token parameter variable">-d</span> c:<span class="token punctuation">\\</span>my<span class="token punctuation">\\</span>source<span class="token punctuation">\\</span>code <span class="token parameter variable">-f</span> html <span class="token parameter variable">-R</span> java-unusedcode

Languages and version suported:
<span class="token function">java</span>

Available report formats and their configuration properties are:
   codeclimate: Code Climate integration.
   csv: Comma-separated values tabular format.
        problem - Include Problem <span class="token function">column</span>   default: <span class="token boolean">true</span>
        package - Include Package <span class="token function">column</span>   default: <span class="token boolean">true</span>
        <span class="token function">file</span> - Include File <span class="token function">column</span>   default: <span class="token boolean">true</span>
        priority - Include Priority <span class="token function">column</span>   default: <span class="token boolean">true</span>
        line - Include Line <span class="token function">column</span>   default: <span class="token boolean">true</span>
        desc - Include Description <span class="token function">column</span>   default: <span class="token boolean">true</span>
        ruleSet - Include Rule <span class="token builtin class-name">set</span> <span class="token function">column</span>   default: <span class="token boolean">true</span>
        rule - Include Rule <span class="token function">column</span>   default: <span class="token boolean">true</span>
   emacs: GNU Emacs integration.
   empty: Empty, nothing.
   html: HTML <span class="token function">format</span>
        linePrefix - Prefix <span class="token keyword">for</span> line number anchor <span class="token keyword">in</span> the <span class="token builtin class-name">source</span> file.
        linkPrefix - Path to HTML source.
   ideaj: IntelliJ IDEA integration.
        classAndMethodName - Class and Method name, pass <span class="token string">&#39;.method&#39;</span> when processing a directory.   default:
        sourcePath - Source path.   default:
        fileName - File name.   default:
   summaryhtml: Summary HTML format.
        linePrefix - Prefix <span class="token keyword">for</span> line number anchor <span class="token keyword">in</span> the <span class="token builtin class-name">source</span> file.
        linkPrefix - Path to HTML source.
   text: Text format.
   textcolor: Text format, with color support <span class="token punctuation">(</span>requires ANSI console support, e.g. xterm, rxvt, etc.<span class="token punctuation">)</span>.
        color - Enables colors with anything other than <span class="token string">&#39;false&#39;</span> or <span class="token string">&#39;0&#39;</span><span class="token builtin class-name">.</span>   default: <span class="token function">yes</span>
   textpad: TextPad integration.
   vbhtml: Vladimir Bossicard HTML format.
   xml: XML format.
        encoding - XML encoding format, defaults to UTF-8.   default: UTF-8
   xslt: XML with a XSL Transformation applied.
        encoding - XML encoding format, defaults to UTF-8.   default: UTF-8
        xsltFilename - The XSLT <span class="token function">file</span> name.
   yahtml: Yet Another HTML format.
        outputDir - Output directory.

For example on windows:
C:<span class="token punctuation">\\</span><span class="token operator">&gt;</span>pmd-bin-6.15.0<span class="token punctuation">\\</span>bin<span class="token punctuation">\\</span>pmd.bat <span class="token parameter variable">-dir</span> c:<span class="token punctuation">\\</span>my<span class="token punctuation">\\</span>source<span class="token punctuation">\\</span>code <span class="token parameter variable">-format</span> text <span class="token parameter variable">-R</span> rulesets/java/quickstart.xml <span class="token parameter variable">-version</span> <span class="token number">1.5</span> <span class="token parameter variable">-language</span> <span class="token function">java</span> <span class="token parameter variable">-debug</span>
C:<span class="token punctuation">\\</span><span class="token operator">&gt;</span>pmd-bin-6.15.0<span class="token punctuation">\\</span>bin<span class="token punctuation">\\</span>pmd.bat <span class="token parameter variable">-dir</span> c:<span class="token punctuation">\\</span>my<span class="token punctuation">\\</span>source<span class="token punctuation">\\</span>code <span class="token parameter variable">-f</span> xml <span class="token parameter variable">-rulesets</span> rulesets/java/quickstart.xml,category/java/codestyle.xml <span class="token parameter variable">-encoding</span> UTF-8
C:<span class="token punctuation">\\</span><span class="token operator">&gt;</span>pmd-bin-6.15.0<span class="token punctuation">\\</span>bin<span class="token punctuation">\\</span>pmd.bat <span class="token parameter variable">-d</span> c:<span class="token punctuation">\\</span>my<span class="token punctuation">\\</span>source<span class="token punctuation">\\</span>code <span class="token parameter variable">-rulesets</span> rulesets/java/quickstart.xml <span class="token parameter variable">-auxclasspath</span> lib<span class="token punctuation">\\</span>commons-collections.jar<span class="token punctuation">;</span>lib<span class="token punctuation">\\</span>derby.jar
C:<span class="token punctuation">\\</span><span class="token operator">&gt;</span>pmd-bin-6.15.0<span class="token punctuation">\\</span>bin<span class="token punctuation">\\</span>pmd.bat <span class="token parameter variable">-d</span> c:<span class="token punctuation">\\</span>my<span class="token punctuation">\\</span>source<span class="token punctuation">\\</span>code <span class="token parameter variable">-f</span> html <span class="token parameter variable">-R</span> rulesets/java/quickstart.xml <span class="token parameter variable">-auxclasspath</span> file:///C:/my/classpathfile

For example on *nix:
$ pmd-bin-6.15.0/bin/run.sh pmd <span class="token parameter variable">-dir</span> /home/workspace/src/main/java/code <span class="token parameter variable">-f</span> html <span class="token parameter variable">-rulesets</span> rulesets/java/quickstart.xml,category/java/codestyle.xml
$ pmd-bin-6.15.0/bin/run.sh pmd <span class="token parameter variable">-d</span> ./src/main/java/code <span class="token parameter variable">-R</span> rulesets/java/quickstart.xml <span class="token parameter variable">-f</span> xslt <span class="token parameter variable">-property</span> <span class="token assign-left variable">xsltFilename</span><span class="token operator">=</span>my-own.xsl
$ pmd-bin-6.15.0/bin/run.sh pmd <span class="token parameter variable">-d</span> ./src/main/java/code <span class="token parameter variable">-f</span> html <span class="token parameter variable">-R</span> rulesets/java/quickstart.xml <span class="token parameter variable">-auxclasspath</span> commons-collections.jar:derby.jar

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h3 id="demo" tabindex="-1"><a class="header-anchor" href="#demo" aria-hidden="true">#</a> DEMO</h3><h3 id="ali-p3c-xml" tabindex="-1"><a class="header-anchor" href="#ali-p3c-xml" aria-hidden="true">#</a> <code>ali-p3c.xml</code></h3><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token prolog">&lt;?xml version=&quot;1.0&quot;?&gt;</span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ruleset</span> <span class="token attr-name"><span class="token namespace">xmlns:</span>xsi</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>http://www.w3.org/2001/XMLSchema-instance<span class="token punctuation">&quot;</span></span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>alibaba-pmd<span class="token punctuation">&quot;</span></span>
         <span class="token attr-name">xmlns</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>http://pmd.sourceforge.net/ruleset/2.0.0<span class="token punctuation">&quot;</span></span>
         <span class="token attr-name"><span class="token namespace">xsi:</span>schemaLocation</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>http://pmd.sourceforge.net/ruleset/2.0.0 http://pmd.sourceforge.net/ruleset_2_0_0.xsd<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>description</span><span class="token punctuation">&gt;</span></span>p3c rule set<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>description</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>rule</span> <span class="token attr-name">ref</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>rulesets/java/ali-concurrent.xml<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>rule</span> <span class="token attr-name">ref</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>rulesets/java/ali-comment.xml<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>rule</span> <span class="token attr-name">ref</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>rulesets/java/ali-constant.xml<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>
	<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>rule</span> <span class="token attr-name">ref</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>rulesets/java/ali-exception.xml<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>
	<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>rule</span> <span class="token attr-name">ref</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>rulesets/java/ali-flowcontrol.xml<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>
	<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>rule</span> <span class="token attr-name">ref</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>rulesets/java/ali-naming.xml<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
        <span class="token comment">&lt;!-- 去掉抽象类命名规范--&gt;</span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>exclude</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>AbstractClassShouldStartWithAbstractNamingRule<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>
        <span class="token comment">&lt;!-- 去掉测试用例命名规范 --&gt;</span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>exclude</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>TestClassShouldEndWithTestNamingRule<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>rule</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>rule</span> <span class="token attr-name">ref</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>rulesets/java/ali-other.xml<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>rule</span> <span class="token attr-name">ref</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>rulesets/java/ali-orm.xml<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>rule</span> <span class="token attr-name">ref</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>rulesets/java/ali-oop.xml<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>rule</span> <span class="token attr-name">ref</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>rulesets/java/ali-set.xml<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ruleset</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="pre-commit" tabindex="-1"><a class="header-anchor" href="#pre-commit" aria-hidden="true">#</a> <code>pre-commit</code></h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token shebang important">#!/bin/sh</span>
<span class="token comment">#</span>
<span class="token comment"># An example hook script to verify what is about to be committed.</span>
<span class="token comment"># Called by &quot;git commit&quot; with no arguments.  The hook should</span>
<span class="token comment"># exit with non-zero status after issuing an appropriate message if</span>
<span class="token comment"># it wants to stop the commit.</span>
<span class="token comment">#</span>
<span class="token comment"># To enable this hook, rename this file to &quot;pre-commit&quot;.</span>

<span class="token assign-left variable">REJECT</span><span class="token operator">=</span><span class="token number">0</span>

<span class="token comment"># BASE_PATH变量中为当前脚本存放的路径</span>
<span class="token assign-left variable">BASE_PATH</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">cd</span> \`dirname $0\`<span class="token punctuation">;</span> <span class="token builtin class-name">pwd</span><span class="token variable">)</span></span>    
<span class="token assign-left variable">PROJECT_ROOT</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">cd</span> <span class="token punctuation">$(</span>dirname $<span class="token punctuation">{</span><span class="token environment constant">BASH_SOURCE</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">}</span><span class="token punctuation">)</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span><span class="token punctuation">;</span> <span class="token builtin class-name">pwd</span><span class="token variable">)</span></span>
<span class="token builtin class-name">echo</span> <span class="token string">&quot;Project Path:<span class="token variable">\${PROJECT_ROOT}</span>&quot;</span>

<span class="token comment"># 读取git暂存区的.java文件</span>
<span class="token assign-left variable">files</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">git</span> <span class="token function">diff</span> <span class="token parameter variable">--cached</span> --name-only <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-E</span> <span class="token string">&#39;\\.java$&#39;</span><span class="token variable">)</span></span>

<span class="token builtin class-name">echo</span> <span class="token string">&quot;==========本次提交的文件==========&quot;</span>
<span class="token builtin class-name">echo</span> <span class="token variable">$files</span>
<span class="token builtin class-name">echo</span> <span class="token string">&quot;==================================&quot;</span>

<span class="token assign-left variable">PMD_DIR</span><span class="token operator">=</span><span class="token variable">\${PROJECT_ROOT}</span>/githook
<span class="token assign-left variable">PMD_JAR</span><span class="token operator">=</span>p3c-pmd-2.1.1-jar-with-dependencies.jar

<span class="token function">java</span> <span class="token parameter variable">-Dfile.encoding</span><span class="token operator">=</span>gbk <span class="token parameter variable">-cp</span> <span class="token variable">\${PMD_DIR}</span>/<span class="token variable">\${PMD_JAR}</span> net.sourceforge.pmd.PMD <span class="token parameter variable">-d</span> <span class="token variable">\${PROJECT_ROOT}</span>/src/main <span class="token parameter variable">-R</span> <span class="token variable">\${PMD_DIR}</span>/ali-p3c.xml <span class="token parameter variable">-f</span> text <span class="token parameter variable">-shortnames</span> -no-cache <span class="token parameter variable">-r</span> <span class="token variable">\${PROJECT_ROOT}</span>/target/pmd_report.txt

<span class="token comment"># 接收上面的java命令执行的结果返回值</span>
<span class="token assign-left variable">REJECT</span><span class="token operator">=</span><span class="token variable">$?</span>
<span class="token keyword">if</span> <span class="token builtin class-name">test</span> $<span class="token punctuation">[</span>REJECT<span class="token punctuation">]</span> <span class="token parameter variable">-eq</span> <span class="token number">0</span>
<span class="token keyword">then</span> 
 <span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token entity" title="\\033">\\033</span>[36m commit success!!! <span class="token entity" title="\\033">\\033</span>[1m&quot;</span>  <span class="token comment">#蓝色打印提交成功</span>
<span class="token keyword">else</span> 
 <span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token entity" title="\\033">\\033</span>[31m 代码提交未通过阿里规范，不允许提交！！！ <span class="token entity" title="\\033">\\033</span>[1m&quot;</span>
 <span class="token builtin class-name">echo</span> <span class="token string">&quot;========================================================错误列表======================================================&quot;</span>
 <span class="token function">cat</span> <span class="token variable">\${PROJECT_ROOT}</span>/target/pmd_report.txt
 <span class="token builtin class-name">echo</span> <span class="token string">&quot;=======================================================================================================================&quot;</span>
<span class="token keyword">fi</span>

<span class="token builtin class-name">echo</span> <span class="token string">&quot;REJECT is <span class="token variable">\${REJECT}</span>&quot;</span>

<span class="token builtin class-name">exit</span> <span class="token variable">$REJECT</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,16),i=[l];function p(o,c){return n(),s("div",null,i)}const u=a(t,[["render",p],["__file","git-hooks.html.vue"]]);export{u as default};
