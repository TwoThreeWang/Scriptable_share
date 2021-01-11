// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: utensils;

// 以下代码仅供学习交流使用

// 判断是否是运行在桌面的组件中
if (config.runsInWidget) {
  // 创建小组件
  const widget = new ListWidget();
  // 添加背景图片
  const imgURL = "https://cdn.jsdelivr.net/gh/TwoThreeWang/Scriptable_share/images/new-plate.png";
  const imgReq = new Request(imgURL);
  const img = await imgReq.loadImage();
  widget.backgroundImage = img;
  // 设置小组件
  Script.setWidget(widget);
} else {
  // 配置选项
  // 一列展示几个选项
  const rowMaxCount = 2;
  // 待选择的每一餐列表
  const options = [
    // 黄焖鸡
    {
      name: "黄焖鸡米饭",
      // Photo by Brooke Lark on Unsplash
      pic:
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=1335&q=80",
    },
    // 沙县
    {
      name: "沙县小吃",
      // Photo by emy on Unsplash
      pic:
        "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    },
    // 兰州拉面
    {
      name: "兰州拉面",
      // Photo by Thomas Tucker on Unsplash
      pic:
        "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    },
    // 吉祥馄饨
    {
      name: "吉祥馄饨",
      // Photo by Robin Stickel on Unsplash
      pic:
        "https://images.unsplash.com/photo-1460306855393-0410f61241c7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    },
    // 猪脚饭
    {
      name: "猪脚饭",
      // Photo by Alex Munsell on Unsplash
      pic:
        "https://images.unsplash.com/photo-1432139555190-58524dae6a55?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    },
    // 炒粉干
    {
      name: "炒粉干",
      // Photo by Davide Cantelli on Unsplash
      pic:
        "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    },
  ];

  // 总计选项的个数
  const optionsCount = options.length;

  // 展示待选列表
  const table = new UITable();

  // 展示待选择的列表
  const remainderCount = optionsCount % rowMaxCount;
  const rows = (optionsCount - remainderCount) / rowMaxCount;
  let rowCountTemp = rowMaxCount;
  const rowsTemp = remainderCount === 0 ? rows : rows + 1;
  for (let i = 0; i < rowsTemp; i++) {
    const row = new UITableRow();
    row.height = 88;
    row.cellSpacing = 16;
    if (i >= rows) {
      rowCountTemp = remainderCount;
    }
    for (let j = 0; j < rowCountTemp; j++) {
      const option = options[i * rowMaxCount + j];
      row.addImageAtURL(option.pic);
      const textCell = row.addText(option.name);
      textCell.titleFont = Font.boldSystemFont(16);
    }
    table.addRow(row);
  }

  // 底部的操作按钮
  const buttonRow = new UITableRow();
  buttonRow.height = 100;
  const selectButton = buttonRow.addButton("点我确定吃什么");
  selectButton.centerAligned();
  selectButton.onTap = randomSelection;
  table.addRow(buttonRow);

  // 选中的结果
  let resultRow = new UITableRow();
  resultRow.addText("来一次吃饭的大冒险吧...");
  table.addRow(resultRow);

  // 展示table
  table.present();

  // 随机选择
  function randomSelection() {
    const optionIndex = Math.floor(Math.random() * optionsCount);
    const optionName = options[optionIndex].name;
    table.removeRow(resultRow);
    resultRow = new UITableRow();
    const resultCell = resultRow.addText(`你选择吃的是：${optionName}`);
    resultCell.titleFont = Font.boldSystemFont(16);
    table.addRow(resultRow);
    table.reload();
    sendNotification(optionName);
  }

  // 发送通知
  function sendNotification(body) {
    const notification = new Notification();
    notification.title = body;
    notification.body = `今天就选择吃${body}啦~`;
    notification.sound = "accept";
    notification.schedule();
  }
}
