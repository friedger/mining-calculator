$(document).ready(function () {
  document.calculate = () => {
    const form = document.forms["calculator"];
    var rewards = parseInt(form["rewards"].value, 10);
    var price = parseInt(form["price"].value, 10);
    var fee = parseInt(form["fee"].value, 10);
    var commit = parseInt(form["commit"].value, 10);
    var totalCommit = parseInt(form["totalCommit"].value, 10);
    var bytes = parseInt(form["bytes"].value, 10);
    var numberOfMiners = parseInt(form["numberOfMiners"].value, 10);
    var profit = parseInt(form["profit"].value, 10);
    var sameAmount = true;
    if (price == null || price == "") {
      return false;
    } else {
      if (sameAmount) {
        const txCosts = fee * bytes;
        const rewardsInSat = rewards * price;

        const numberOfMiners = Math.floor(rewardsInSat / (commit + txCosts));
        const totalCommit = numberOfMiners * commit;
        const profit = Math.floor(
          ((rewards * price - numberOfMiners * (commit + txCosts)) * commit) /
            totalCommit
        );
        const totalCosts = numberOfMiners * (commit + txCosts);
        document.getElementsByName("numberOfMiners")[0].value = numberOfMiners;
        document.getElementsByName("totalCommit")[0].value = totalCommit;
        document.getElementsByName("profit")[0].value = profit;
        document.getElementsByName("txCosts")[0].value = txCosts;
        document.getElementsByName("totalCosts")[0].value = totalCosts;
        document.getElementsByName("rewardsInSat")[0].value = rewardsInSat;
        document.getElementById("customNumberOfMiners").max = numberOfMiners;
        document.getElementById("customNumberOfMiners").value = numberOfMiners;
        document.getElementById("customNumber").innerHTML = numberOfMiners;
        document.getElementById("customNumberOfMiners2").max = numberOfMiners;
        document.getElementById("customNumberOfMiners2").value = 0;
        document.getElementById("customNumber2").innerHTML = 0;
        document.getElementById("customNumberOfMiners10").max = numberOfMiners;
        document.getElementById("customNumberOfMiners10").value = 0;
        document.getElementById("customNumber").innerHTML = 0;
        document.updateNumber();
      } else {
        const profit = 0;
      }
      return true;
    }
  };

  document.updateNumber = () => {
    const customNumber = parseInt(
      document.getElementById("customNumberOfMiners").value,
      10
    );
    const customNumber2 = parseInt(
      document.getElementById("customNumberOfMiners2").value,
      10
    );
    const customNumber10 = parseInt(
      document.getElementById("customNumberOfMiners10").value,
      10
    );
    const form = document.forms["calculator"];
    var rewardsInStx = parseInt(form["rewards"].value, 10);
    var price = parseInt(form["price"].value, 10);
    var fee = parseInt(form["fee"].value, 10);
    var commit = parseInt(form["commit"].value, 10);
    var bytes = parseInt(form["bytes"].value, 10);

    document.getElementById("customNumber").innerHTML = customNumber;
    document.getElementById("customNumber2").innerHTML = customNumber2;
    document.getElementById("customNumber10").innerHTML = customNumber10;

    const totalCommit =
      customNumber * commit +
      customNumber2 * 2 * commit +
      customNumber10 * 10 * commit;
    const rewards = (commit / totalCommit) * rewardsInStx * price;
    const rewards2 = ((2 * commit) / totalCommit) * rewardsInStx * price;
    const rewards10 = ((10 * commit) / totalCommit) * rewardsInStx * price;
    const profit = Math.floor(rewards - (commit + fee * bytes));
    const profit2 = Math.floor(rewards2 - (2 * commit + fee * bytes));
    const profit10 = Math.floor(rewards10 - (10 * commit + fee * bytes));

    document.getElementsByName("customProfit")[0].value =
      customNumber > 0 ? profit : 0;
    document.getElementsByName("customProfit2")[0].value =
      customNumber2 > 0 ? profit2 : 0;
    document.getElementsByName("customProfit10")[0].value =
      customNumber10 > 0 ? profit10 : 0;
    // probability to win
    document.getElementsByName("customChance")[0].value =
      customNumber > 0 ? ((commit / totalCommit) * 100).toFixed(2) : 0;
    document.getElementsByName("customChance2")[0].value =
      customNumber2 > 0 ? (((2 * commit) / totalCommit) * 100).toFixed(2) : 0;
    document.getElementsByName("customChance10")[0].value =
      customNumber10 > 0 ? (((10 * commit) / totalCommit) * 100).toFixed(2) : 0;
  };

  function dailyProfit(commit, totalCommit, numberOfMiners) {
    const blocks = 140;
    const expectedWins = Math.floor(blocks * (commit / totalCommit));
    const probabilityToWin = commit / totalCommit;

    let probabilityToMeetExpectation = 0;
    for (let wins = expectedWins; wins < blocks; wins++) {
      probabilityToMeetExpectation =
        probabilityToMeetExpectation +
        binomialCoeff(blocks, wins) *
          Math.pow(probabilityToWin, wins) *
          Math.pow(1 - probabilityToWin, blocks - wins);
    }
    console.log(probabilityToMeetExpectation);
    return probabilityToMeetExpectation;
  }

  function binomialCoeff(n, k) {
    if (k + k > n) {
      k = n - k;
    }
    if (k < 0) {
      return 0;
    } else {
      var result = 1;
      for (i = 0; i < k; ) {
        result = (result * (n - i)) / ++i;
      }
      return result;
    }
  }

  function fetchFees() {
    Promise.all([
      fetch("https://bitcoinfees.earn.com/api/v1/fees/recommended"),
      fetch("https://api.binance.com/api/v3/ticker/price?symbol=STXBTC"),
    ])
      .then((response) => Promise.all(response.map((r) => r.json())))
      .then((result) => {
        const form = document.forms["calculator"];
        form["fee"].value = result[0].fastestFee;
        form["price"].value = result[1].price * 100000000;
        document.calculate();
      });
  }

  // export
  document.fetchFees = fetchFees;

  // execute once
  fetchFees();
});
