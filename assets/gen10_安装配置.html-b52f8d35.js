import{_ as a,M as d,p as t,q as r,R as e,t as s,N as l,a1 as i}from"./framework-449724a9.js";const v={},c=i(`<h1 id="gep10" tabindex="-1"><a class="header-anchor" href="#gep10" aria-hidden="true">#</a> gep10+</h1><h2 id="ilo5" tabindex="-1"><a class="header-anchor" href="#ilo5" aria-hidden="true">#</a> ilo5</h2><ul><li>参考：https://kjzjj.com/index.php/2021/05/07/gen10-plus-ilo-advanced%e7%94%b3%e8%af%b7%e5%8f%8a%e5%8a%9f%e8%83%bd%e5%af%b9%e6%af%94/</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>35DPH-SVSXJ-HGBJN-C7N5R-2SS4W
32CRX-V7BXC-D2MZN-L2DYZ-LZ88W
35395-JZ6HT-LP7QS-RG3V3-H59R2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="ilo" tabindex="-1"><a class="header-anchor" href="#ilo" aria-hidden="true">#</a> ILO</h2><ul><li><p>参考：https://post.smzdm.com/p/avw6zgk7/</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>1.必要的设置。 开机 按F9进入BIOS设置，先将语言改为中文（高手请无视）
2.系统实用工具/系统配置/ILO5配置程序/网络选项
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>中文：https://www.opss.cn/5707.html</p></li><li><p>显卡</p><ul><li>GT1030</li></ul></li></ul><h2 id="安装exis" tabindex="-1"><a class="header-anchor" href="#安装exis" aria-hidden="true">#</a> 安装Exis</h2>`,7),u=e("li",null,[e("p",null,"如何不让ESXi7.0的虚拟闪存占掉你的小硬盘https://www.jianshu.com/p/eb5712db1624")],-1),m={href:"https://kjzjj.com/index.php/2021/05/09/gen10-plus-esxi-7-0-2/",target:"_blank",rel:"noopener noreferrer"},o=i(`<li><p>https://rufus.ie/zh/#</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>esxi 安装u盘后，虚拟内存为0，剩余空间NAN

补充一下：后来esxi已经解决突破8核心的限制了，安装特殊的序列号即可（下面几个可用）
JA0W8-AX216-08E19-A995H-1PHH2
JU45H-6PHD4-481T1-5C37P-1FKQ2
1U25H-DV05N-H81Y8-7LA7P-8P0N4
HV49K-8G013-H8528-P09X6-A220A
1G6DU-4LJ1K-48451-3T0X6-3G2MD
5U4TK-DML1M-M8550-XK1QP-1A052

来源：多多软件站的 《vmware esxi 7.0序列号》
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>`,1),p=i(`<h2 id="pcie" tabindex="-1"><a class="header-anchor" href="#pcie" aria-hidden="true">#</a> PCIE</h2><ul><li><p>pcie自带一个拆分两个槽，一个给iLo专用，另一个还可以拆分成2个nvme和一个万兆网卡，威联通或者群辉有这样的复合卡。显卡的话，就只能一个显卡了。</p></li><li><p>qnap pcie卡</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>https://post.smzdm.com/p/a3gv22ok/
QNAP 威联通 NAS 网络存储 配件 QXG-10G1T 单万兆电口网络扩充卡
西部数据（Western Digital）1T SSD固态硬盘 M.2接口 （NVMe协议）WD Blue SN550 四通道PCIe 高速 大容量

注意：
1. 同款qnap pcie卡，据说是挑盘的，我按照另外一位大佬的文章，接的是两块S3520，没问题，不过被gen10 plus的软raid搞死，只支持windows，装esxi内牛满面
2. https://www.chiphell.com/thread-2295095-1-1.html ： 傲腾16g 32g都可以识别，西数sn750 500g、三星970evo plus 不识别 ; sn500 500g可以
3. 折腾了好多块ssd，最后选择是威联通拆分卡，一块32g傲腾安装esxi，一块1t的sn550装vm。


威联通那张只能用SATA版的，nvme版的兼容性有问题


esxi 安装到这个卡所在的 ssd 里比较好，因为这样的话，可以把硬盘控制器直通出去。如果你系统装在 sata 那 4 块盘里。那四块硬盘无法直通出去，因为 4 个硬盘用了一个控制器，这个控制器已经被 esxi 占了。

威联通有个万兆 + 双 nvme 的，pcie 通道貌似减半，还带小风扇
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h2 id="网络" tabindex="-1"><a class="header-anchor" href="#网络" aria-hidden="true">#</a> 网络</h2>`,3),b={href:"https://kjzjj.com/index.php/2021/05/10/gen10-plus-vmnetwork/",target:"_blank",rel:"noopener noreferrer"},h=i(`<h2 id="nas" tabindex="-1"><a class="header-anchor" href="#nas" aria-hidden="true">#</a> nas</h2><ul><li><p>NAS 详细搭建方案 - 安装宿主系统ESXI： https://blog.csdn.net/aa13058219642/article/details/88622216</p></li><li><p>freenas配置：https://www.somata.net/2019/freenas_simple_use.html</p><ul><li><p>mount -t nfs 10.0.0.202:/mnt/mypool /mnt/mypool</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>-- mount.nfs: Protocol not supported 指定nfs协议版本
mount -t nfs -o rw,nfsvers=3 10.0.0.202:/mnt/data  /mnt/data
mount -t nfs -o rw,nfsvers=3 10.0.0.202:/mnt/data  /mnt/data
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>lftp -u data,data_123 10.0.0.202</p></li></ul></li><li><p>111</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>参考：https://blog.csdn.net/weixin_30479445/article/details/112014915?utm_term=centos%E6%8C%82%E8%BD%BDnas%E5%AD%98%E5%82%A8&amp;utm_medium=distribute.pc_aggpage_search_result.none-task-blog-2~all~sobaiduweb~default-0-112014915&amp;spm=3001.4430

smbclient -L 10.0.0.202 -U username%password #列出该IP地址所提供的共享文件夹
smbclient //10.0.0.202/mypool -U data%data_123
mount -o username=data,password=data_123 //10.0.0.202/mypool /mnt/mypool/
这样就可以到/mnt/smb访问nas了。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>20211114</p><ul><li>参照：https://www.opss.cn/5859.html</li></ul></li></ul><h2 id="直通硬盘" tabindex="-1"><a class="header-anchor" href="#直通硬盘" aria-hidden="true">#</a> 直通硬盘</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>适用于hpe g10 plus
1、进bios设置控制器工作模式为ahci（默认应该就是这个，检查一下）
2、安装好ESXI6.7或者7.0，并开启SSH登陆权限
3、插入一块硬盘，没有硬盘的话esxi里是不显示控制器的
4、SSH登陆ESXI主机，运行vi /etc/vmware/passthru.map
5、在配置文件末尾添加下面的代码
# Intel Point SATA AHCI controller
8086  a352  d3d0  false
保存并退出，重启ESXI

# 直通讲解
https://www.bilibili.com/video/BV1r4411r7Fv?spm_id_from=333.999.0.0

# ssh esxi服务器，直通命令
vmkfstools -z  /vmfs/devices/disks/t10.ATA_____WDC_WD40EFAX2D68JH4N1_________________________WD2DWX42D3163V73  /vmfs/volumes/617c01e0-9a455e22-dbae-b47af1def5f0/ATA_4T.vmdk
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>MXQ1291J1L
P16006-001

保修：原厂保修，国内华三4008100504
保修查询网址：https://support.hpe.com/hpsc/wc/public/home


走捷径 4个sata硬盘位可以插SSD，也可以在主板的pcie插口加装转接卡装NVME盘
推荐 “佳翼冷雨燕M.2 NVME SSD转pcie3.0x4”这样外形的，直接插入PCIE接口，比带挡板的方便多了

ilo界面
https://post.m.smzdm.com/p/akx49ler/
https://www.smyz.net/pc/12108.html

VMware ESXi 慧与专版镜像下载地址 
https://my.vmware.com/zh/group/vmware/details?downloadGroup=OEM-ESXI70-HPE&amp;productId=974

肯定不能，这机器，是一个pcie自带一个拆分两个槽，一个给iLo专用，另一个还可以拆分成2个nvme和一个万兆网卡，威联通或者群辉有这样的复合卡。显卡的话，就只能一个显卡了

显卡：翔升gtx1650

https://post.m.smzdm.com/p/alxqz5qg/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="openwrt" tabindex="-1"><a class="header-anchor" href="#openwrt" aria-hidden="true">#</a> openwrt</h2><ul><li><p>http://www.geet.cc/?dir=d/OpenWrt</p></li><li><p>订阅</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>https://free.kingfu.cf/shadowrocket
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li></ul>`,7);function _(x,g){const n=d("ExternalLinkIcon");return t(),r("div",null,[c,e("ul",null,[u,e("li",null,[e("p",null,[e("a",m,[s("Gen10 Plus ESXI 7.0.2安装或升级"),l(n)])])]),o]),p,e("ul",null,[e("li",null,[e("a",b,[s("Gen10 Plus网卡直通测试和配置方案"),l(n)])])]),h])}const w=a(v,[["render",_],["__file","gen10_安装配置.html.vue"]]);export{w as default};
