# 工作流的名称，因为它将显示在 GitHub 存储库的“操作”选项卡中。如果省略此字段，则将改用工作流文件的名称。
name: learn-github-actions
# 可选 - 从工作流生成的工作流运行的名称，将显示在存储库“操作”选项卡上的工作流运行列表中。此示例使用带有上下文的表达式来显示触发工作流运行的参与者的 github 用户名。有关详细信息，请参阅“ GitHub 操作的工作流语法”。
run-name: ${{ github.actor }} is learning GitHub Actions
# 指定此工作流的触发器。此示例使用该 push 事件，因此每次有人将更改推送到存储库或合并拉取请求时，都会触发工作流运行。这是由推送到每个分支触发的;有关仅在推送到特定分支、路径或标记时运行的语法示例，请参阅“ GitHub 操作的工作流语法”。
on: [push]
# 将 learn-github-actions 工作流中运行的所有作业组合在一起。
jobs:
  # 定义名为 check-bats-version 的作业。子键将定义作业的属性。
  check-bats-version:
    runs-on: ubuntu-latest
    steps:
      # 关键字 uses 指定此步骤将运行 v3 actions/checkout 操作。这是一个将存储库签出到运行器上的操作，允许您针对代码运行脚本或其他操作（例如构建和测试工具）。每当工作流使用存储库的代码时，都应使用签出操作。
      - uses: actions/checkout@v3
      # 此步骤使用该 actions/setup-node@v3 操作来安装指定版本的 Node.js。（此示例使用版本 14。这会将 和 npm 命令 node 都放在 PATH .
      - uses: actions/setup-node@v3
        with:
          node-version: '14'
      # 关键字 run 告诉作业在运行器上执行命令。在本例中，您将用于 npm 安装 bats 软件测试包。
      - run: npm install -g bats
      # 您将使用输出软件版本的参数运行 bats 该命令。
      - run: bats -v
