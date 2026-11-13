const coins = {
  BTC:{name:"Bitcoin",symbol:"BTC",price:68420,change:2.41,icon:"₿",color:"#f7931a"},
  ETH:{name:"Ethereum",symbol:"ETH",price:3520.80,change:1.82,icon:"◆",color:"#7785f7"},
  SOL:{name:"Solana",symbol:"SOL",price:148.65,change:-0.74,icon:"◎",color:"#8d6bfa"},
  USDT:{name:"Tether",symbol:"USDT",price:1,change:0.02,icon:"₮",color:"#26a17b"}
};
let balance = 12480.50;
let transactions = [];
const $ = id => document.getElementById(id);
const money = n => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
function renderMarkets(){
  $("marketRows").innerHTML = Object.values(coins).map(c=>`
    <div class="market-row">
      <div class="coin-name"><span class="coin-icon" style="background:${c.color}22;color:${c.color}">${c.icon}</span><span>${c.name}<small class="coin-symbol">${c.symbol}</small></span></div>
      <div class="price">${money(c.price)}</div>
      <div class="${c.change>=0?"positive":"negative"}">${c.change>=0?"+":""}${c.change.toFixed(2)}%</div>
      <button class="mini-btn" data-buy="${c.symbol}">Обменять</button>
    </div>`).join("");
  document.querySelectorAll("[data-buy]").forEach(btn=>btn.addEventListener("click",()=>{
    $("toCoin").value=btn.dataset.buy; $("trade").scrollIntoView({behavior:"smooth"}); updateEstimate();
  }));
}
function updateBalance(){ $("totalBalance").textContent=money(balance); $("availableBalance").textContent=money(balance); }
function estimate(){
  const from=$("fromCoin").value,to=$("toCoin").value,amount=Number($("fromAmount").value);
  if(!Number.isFinite(amount)||amount<0)return 0;
  return amount*coins[from].price/coins[to].price;
}
function updateEstimate(){
  const from=$("fromCoin").value,to=$("toCoin").value,amount=Number($("fromAmount").value)||0;
  const result=estimate();
  $("toAmount").textContent=`≈ ${result.toLocaleString("en-US",{maximumFractionDigits:8})} ${to}`;
  $("rateInfo").textContent=`Курс: 1 ${from} = ${(coins[from].price/coins[to].price).toLocaleString("en-US",{maximumFractionDigits:6})} ${to}`;
}
function showToast(message){
  const toast=$("toast"); toast.textContent=message; toast.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>toast.classList.remove("show"),2800);
}
function renderTransactions(){
  if(!transactions.length){$("transactions").innerHTML='<div class="empty-state">Пока нет операций. Попробуйте выполнить демо-обмен.</div>';return;}
  $("transactions").innerHTML=transactions.map(t=>`
    <div class="transaction"><div class="tx-left"><div class="tx-icon">⇄</div><div><div class="tx-title">${t.fromAmount} ${t.from} → ${t.to}</div><div class="tx-date">${t.date}</div></div></div><div class="tx-amount positive">+${t.toAmount} ${t.to}</div></div>`).join("");
}
function exchange(){
  const from=$("fromCoin").value,to=$("toCoin").value,amount=Number($("fromAmount").value);
  if(from===to){showToast("Выберите разные криптовалюты.");return;}
  if(!Number.isFinite(amount)||amount<=0){showToast("Введите сумму больше нуля.");return;}
  const usd=amount*coins[from].price;
  if(usd>balance){showToast("Недостаточно средств на демо-балансе.");return;}
  const result=estimate();
  balance-=usd*0.001; // условная комиссия 0,1% в учебной симуляции
  transactions.unshift({fromAmount:amount.toFixed(6).replace(/0+$/,"").replace(/\.$/,""),from,to,toAmount:result.toFixed(6).replace(/0+$/,"").replace(/\.$/,""),date:new Date().toLocaleString("ru-RU")});
  updateBalance();renderTransactions();showToast("Демо-обмен выполнен. Реальные средства не списывались.");
}
$("fromCoin").addEventListener("change",updateEstimate);
$("toCoin").addEventListener("change",updateEstimate);
$("fromAmount").addEventListener("input",updateEstimate);
$("exchangeBtn").addEventListener("click",exchange);
$("swapCoins").addEventListener("click",()=>{const old=$("fromCoin").value;$("fromCoin").value=$("toCoin").value;$("toCoin").value=old;updateEstimate();});
$("goTrade").addEventListener("click",()=>$("trade").scrollIntoView({behavior:"smooth"}));
$("addFunds").addEventListener("click",()=>{balance+=500;updateBalance();showToast("На демо-баланс добавлено $500.");});
$("themeToggle").addEventListener("click",()=>document.body.classList.toggle("light"));
renderMarkets();updateBalance();updateEstimate();renderTransactions();
