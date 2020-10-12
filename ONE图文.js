/**
插件介绍
「ONE · 一个」 每日更新一张精美的图片和文字，展示在桌面组件上。

插件使用
添加桌面组件，选择 Scriptable 应用，然后点击组件配置，选择这个项目的加载代码Loader.Github或Loader.Gitee，然后参数输入参考如下说明，默认填写one即可使用本组件。

支持组件尺寸
小尺寸 Small
中尺寸 Medium
大尺寸 Large
接受参数
int类型，为要显示的第几个内容，默认0，就是当天的数据，如果是1，则为昨天的数据，以此类推，最大支持9

比如参数直接填写：one、one:1、one@latest:1 都是可以的
**/

class Im3xWidget {
  // 初始化，接收参数
  constructor (arg) {
    console.log('init.arg=')
    console.log(arg)
    this.arg = parseInt(arg)
    if (!Number.isInteger(this.arg)) this.arg = 0
  }
  // 渲染组件
  async render () {
    let data = await this.getData()
    let widget = await (config.widgetFamily === 'large') ? this.renderLarge(data) : this.renderSmall(data)
    return widget
  }

  async renderLarge (one) {
    let w = new ListWidget()
  
    if (!one) return await this.renderErr(w)
  
    w.url = one["url"]
    
  //   时间
    const dates = one["date"].split(" / ")
    let date1 = w.addText(dates[2])
    date1.font = Font.lightSystemFont(60)
    date1.centerAlignText()
    date1.textColor = Color.white()
    
    let line = w.addText("————".repeat(2))
    line.textOpacity = 0.5
    line.centerAlignText()
    line.textColor = Color.white()
    
    let date2 = w.addText(dates[0] + " / " + dates[1])
    date2.font = Font.lightMonospacedSystemFont(30)
    date2.centerAlignText()
    date2.textColor = Color.white()
    date2.textOpacity = 0.7
  
  //   换行
    w.addSpacer(20)
  //   内容
    let body = w.addText(one["content"])
    body.font = Font.lightSystemFont(22)
    body.textColor = Color.white()
    
    w.addSpacer(50)
    
    let author = w.addText("—— " + one["text_authors"])
    author.rightAlignText()
    author.font = Font.lightSystemFont(14)
    author.textColor = Color.white()
    author.textOpacity = 0.8
  
  // 加载背景图片
    let bg = await this.getImage(one["img_url"])
  
    w.backgroundImage = await this.shadowImage(bg)
  //   记得最后返回组件
    return w
  }

  async renderSmall (one) {
    console.log('create.small.widget')
    let w = new ListWidget()
    
    if (!one) return await this.renderErr(w)
    
    w.url = one["url"]
    console.log(w.url)
  
    w = await this.renderHeader(w)
    console.log('render.header.done')
  
    let body = w.addText(one['content'])
    body.textColor = Color.white()
    body.font = Font.lightSystemFont(config.widgetFamily === 'small' ? 14 : 16)
    w.addSpacer(10)
    let footer = w.addText('—— ' + one['text_authors'])
    footer.rightAlignText()
    footer.textColor = Color.white()
    footer.textOpacity = 0.8
    footer.font = Font.lightSystemFont(12)
  
    // 加载背景图片
    let bg = await this.getImage(one["img_url"])
  
    w.backgroundImage = await this.shadowImage(bg)
    console.log('create.small.widget.done')
    return w
  }

  async renderErr (widget) {
    let err = widget.addText("💔 加载失败，稍后重试..")
    err.textColor = Color.red()
    err.centerAlignText()
    return widget
  }
  async renderHeader (widget) {
    let header = widget.addStack()
    let icon = header.addImage(await this.getImage("http://image.wufazhuce.com/apple-touch-icon.png"))
    icon.imageSize = new Size(15, 15)
    icon.cornerRadius = 4
    let title = header.addText("「ONE · 一个」")
    title.font = Font.mediumSystemFont(13)
    title.textColor = Color.white()
    title.textOpacity = 0.7
    widget.addSpacer(20)
    return widget
  }
  async getData () {
    const API = "http://m.wufazhuce.com/one";
    const req1 = new Request(API)
    // await req1.load()
    const body1 = await req1.loadString()
    const token = body1.split("One.token = '")[1].split("'")[0]
    
    const API2 = "http://m.wufazhuce.com/one/ajaxlist/0?_token=" + token
    const req2 = new Request(API2)
    const res2 = await req2.loadJSON()
    const data = res2["data"]
    console.log('arg====')

    return data ? data[this.arg] : false
  }
  async getImage (url) {
    let r = new Request(url)
    return await r.loadImage()
  }
  async shadowImage (img) {
    let ctx = new DrawContext()
    // 获取图片的尺寸
    ctx.size = img.size
    
    ctx.drawImageInRect(img, new Rect(0, 0, img.size['width'], img.size['height']))
    ctx.setFillColor(new Color("#000000", 0.7))
    ctx.fillRect(new Rect(0, 0, img.size['width'], img.size['height']))
    
    let res = await ctx.getImage()
    return res
  }
  // 用于测试
  async test () {
    if (config.runsInWidget) return
    let widget = await this.render()
    widget.presentSmall()
  }
  // 单独运行
  async init () {
    if (!config.runsInWidget) return
    try {
      this.arg = parseInt(args.widgetParameter)
      if (!Number.isInteger(this.arg)) this.arg = 0
    } catch (e) {}
    let widget = await this.render()
    Script.setWidget(widget)
    Script.complete()
  }
}

module.exports = Im3xWidget
// 如果是在编辑器内编辑、运行、测试，则取消注释这行，便于调试：
// await new Im3xWidget().test()

// 如果是组件单独使用（桌面配置选择这个组件使用，则取消注释这一行：
await new Im3xWidget(args.widgetParameter).init()
