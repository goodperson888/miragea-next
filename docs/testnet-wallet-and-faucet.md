# MIRAGEA AI 测试网钱包与测试币领取说明

本文档用于比赛 Demo。所有资产均为测试网或 Demo 资产，无现金价值，不支持真实充值、提现或交易。

## 1. 推荐方案

当前建议使用：

- 钱包：MetaMask
- 网络：Base Sepolia
- Gas 测试币：Base Sepolia ETH
- 产品展示资产：HTX / USDT / IP 币
- 测试网实现资产：Mock HTX / Mock USDT / Mock IP Coin

说明：目前不建议依赖“HTX 官方测试币水龙头”。公开资料里没有稳定、通用、适合比赛现场使用的 HTX 测试币 faucet。比赛阶段更稳的做法是用 Base Sepolia ETH 作为链上 gas，用自部署 Mock ERC20 表示产品中的 `HTX`、`USDT` 和剧集 `IP 币` 资产。

## 2. 添加 Base Sepolia

前端已经支持自动请求添加/切换 Base Sepolia。点击页面右上角 `连接钱包` 即可。

手动配置也可以：

```text
Network name: Base Sepolia
RPC URL: https://sepolia.base.org
Chain ID: 84532
Currency symbol: ETH
Block explorer: https://sepolia.basescan.org
```

## 3. 领取 Base Sepolia ETH

你可以从 Base 官方文档列出的 faucet 入口领取测试 ETH：

```text
https://docs.base.org/base-chain/network-information/network-faucets
```

常见步骤：

1. 打开 faucet 页面。
2. 连接钱包或粘贴钱包地址。
3. 选择 Base Sepolia。
4. 领取测试 ETH。
5. 回到 MetaMask，确认 Base Sepolia 上有 ETH 余额。

如果 faucet 限流，可以换另一个官方文档列出的 faucet，或稍后再领。

## 4. HTX 测试资产怎么处理

比赛版建议不要找真实 HTX 测试币，而是部署一个 Mock ERC20。前端可以展示为 `HTX`，合约名保留 `HTX Demo Token` 以区分测试环境：

```text
Token name: HTX Demo Token
Symbol: HTX
Decimals: 18
Network: Base Sepolia
```

产品 UI 中的 `HTX`、`USDT`、剧情预测代币、剧集 `IP 币` 都应标记为 Demo / Testnet Simulation。

市场和支付界面可以按生产版展示多种支付方式：

- 法币
- U / USDT
- HTX
- IP 币
- Web3 钱包

但比赛版不执行真实法币支付、真实充值提现或真实交易撮合。

后续可加一个简单合约：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockHTX {
    string public name = "HTX Demo Token";
    string public symbol = "HTX";
    uint8 public decimals = 18;
    mapping(address => uint256) public balanceOf;

    event Transfer(address indexed from, address indexed to, uint256 value);

    function faucet() external {
        uint256 amount = 1000 ether;
        balanceOf[msg.sender] += amount;
        emit Transfer(address(0), msg.sender, amount);
    }
}
```

## 5. Demo 口径

路演时建议这样说：

```text
当前版本运行在测试网模拟盘模式。钱包用于证明 Web3 账户身份，Base Sepolia ETH 只用于测试网 gas。HTX、USDT、预测代币和剧集 IP 币均为 Demo Token，没有现金价值，也不会进行真实充值、提现或交易。
```

## 6. 后续接真实资产前必须补齐

- 地域合规开关
- KYC / AML
- 真实支付或交易服务商合规评估
- 资金账本与对账
- 风控、反刷票、反操纵
- 投票封存与审计日志
- App Store / Google Play 上架策略
