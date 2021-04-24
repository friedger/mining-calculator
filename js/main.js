document.calculate = () => {
  const form = document.forms["calculator"];
  var rewards = parseInt(form["rewards"].value, 10);
  var price = parseInt(form["price"].value, 10);
  var fee = parseInt(form["fee"].value, 10);
  var commit = parseInt(form["commit"].value, 10);
  var totalCommit = parseInt(form["totalCommit"].value, 10);
  var bytes = parseInt(form["bytes"].value, 10);
  var numberOfMiners = parseInt(form["numberOfMiners"].value, 10);
  var customNumberOfMinersExcess = parseInt(
    document.getElementById("customNumberOfMinersExcess").value ||
      numberOfMiners,
    10
  );
  var customTotalCommit = parseInt(
    document.getElementById("totalCommitExcess").value || totalCommit,
    10
  );
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
        (rewardsInSat * commit) / totalCommit - (commit + txCosts)
      );
      const totalCosts = numberOfMiners * (commit + txCosts);
      const excessValue = rewardsInSat - customNumberOfMinersExcess * txCosts;
      const minersShare = Math.floor(
        ((excessValue - customTotalCommit) / excessValue) * 100
      );
      const minersNonShare = 100 - minersShare;
      document.getElementsByName("numberOfMiners")[0].value = numberOfMiners;
      document.getElementsByName("totalCommit")[0].value = totalCommit;
      document.getElementsByName("profit")[0].value = profit;
      document.getElementsByName("txCosts")[0].value = txCosts;
      document.getElementsByName("totalCosts")[0].value = totalCosts;
      document.getElementsByName("rewardsInSat")[0].value = rewardsInSat;
      document.getElementById(
        "customNumberOfMinersExcess"
      ).value = customNumberOfMinersExcess;
      document.getElementById("totalCommitExcess").value = customTotalCommit;
      document.getElementById("excessValue").value = excessValue;
      document.getElementById("excessDistribution").value =
        minersShare + ":" + minersNonShare;
      document.getElementById("customNumberOfMiners").max = numberOfMiners;
      document.getElementById("customNumberOfMiners").value = numberOfMiners;
      document.getElementById("customNumber").innerHTML = numberOfMiners;
      document.getElementById("customNumberOfMiners2").max = numberOfMiners;
      document.getElementById("customNumberOfMiners2").value = 0;
      document.getElementById("customNumber2").innerHTML = 0;
      document.getElementById("customNumberOfMiners10").max = numberOfMiners;
      document.getElementById("customNumberOfMiners10").value = 0;
      document.getElementById("customNumber").innerHTML = 0;

      document.getElementById("customCommit").max = rewardsInSat;
      document.getElementById("customCommit").value = commit;
      document.getElementById("customCommitLabel").innerHTML = commit;
      document.getElementById("customTotalCommit").max = rewardsInSat;
      document.getElementById("customTotalCommit").value = totalCommit;
      document.getElementById("customTotalCommitLabel").innerHTML = totalCommit;

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
  const rewardsInStx = parseInt(form["rewards"].value, 10);
  const price = parseInt(form["price"].value, 10);
  const fee = parseInt(form["fee"].value, 10);
  const commit = parseInt(form["commit"].value, 10);
  const bytes = parseInt(form["bytes"].value, 10);
  const txCosts = fee * bytes;
  const rewardsInSat = rewardsInStx * price;

  document.getElementById("customNumber").innerHTML = customNumber;
  document.getElementById("customNumber2").innerHTML = customNumber2;
  document.getElementById("customNumber10").innerHTML = customNumber10;

  const totalCommit =
    customNumber * commit +
    customNumber2 * 2 * commit +
    customNumber10 * 10 * commit;
  const numberOfMiners = customNumber + customNumber2 + customNumber10;
  const rewards = (commit / totalCommit) * rewardsInSat;
  const rewards2 = ((2 * commit) / totalCommit) * rewardsInSat;
  const rewards10 = ((10 * commit) / totalCommit) * rewardsInSat;
  const profit = Math.floor(rewards - (commit + txCosts));
  const profit2 = Math.floor(rewards2 - (2 * commit + txCosts));
  const profit10 = Math.floor(rewards10 - (10 * commit + txCosts));

  console.log({ profit, profit2, profit10 });
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
      document.updateCommit();
    });
}

document.updateCommit = () => {
  const commit = parseInt(document.getElementById("customCommit").value, 10);
  document.getElementById("customTotalCommit").min = commit;

  const totalCommit = parseInt(
    document.getElementById("customTotalCommit").value,
    10
  );
  document.getElementById(
    "customCommitLabel"
  ).innerHTML = commit.toLocaleString("en-US", { useGrouping: true });
  document.getElementById(
    "customTotalCommitLabel"
  ).innerHTML = totalCommit.toLocaleString("en-US", { useGrouping: true });

  const {
    probForDisappointment,
    probForLoss,
    costs,
    expectedRewards,
  } = probabilitiesInPeriod(commit, totalCommit, 1000);
  console.log({ probForDisappointment, probForLoss, costs, expectedRewards });

  const {
    probForDisappointment1,
    probForLoss1,
    costs1,
    expectedRewards1,
  } = probabilitiesInPeriod(commit, totalCommit, 1);
  console.log({
    probForDisappointment1,
    probForLoss1,
    costs1,
    expectedRewards1,
  });
  document.getElementById("customCosts").value = costs;
  document.getElementById("customRewards").value = expectedRewards;

  document.getElementById("customProbToMakeProfit").value = (
    (1 - probForLoss) *
    100
  ).toFixed(2);
  document.getElementById("customProbToGetRewards").value = (
    (1 - probForDisappointment) *
    100
  ).toFixed(2);
};

function probabilitiesInPeriod(commit, totalCommit, blocks) {
  const form = document.forms["calculator"];
  var rewardsInStx = parseInt(form["rewards"].value, 10);
  var price = parseInt(form["price"].value, 10);
  var fee = parseInt(form["fee"].value, 10);
  var bytes = parseInt(form["bytes"].value, 10);

  const prob = commit / totalCommit;
  const costs = (commit + bytes * fee) * blocks;
  const rewardsInSat = rewardsInStx * price;
  const expectedBlocksToWin = Math.ceil((blocks * commit) / totalCommit);
  const expectedRewards = rewardsInSat * expectedBlocksToWin;
  const minWins = Math.ceil(costs / rewardsInSat);

  const probForDisappointment = probabilityToWinLess(
    prob,
    expectedBlocksToWin,
    blocks
  );
  const probForLoss = probabilityToWinLess(prob, minWins, blocks);
  return {
    probForDisappointment,
    probForLoss,
    costs,
    expectedRewards,
  };
}

function probabilityToWinLess(prob, totalWins, blocks) {
  let totalProb = 0;
  for (let wins = 0; wins < totalWins; wins++) {
    totalProb = totalProb + probabilityToWinExactly(prob, wins, blocks);
  }
  return totalProb;
}

function probabilityToWinExactly(prob, wins, blocks) {
  return (
    binomialCoeff(blocks, wins) *
    Math.pow(prob, wins) *
    Math.pow(1 - prob, blocks - wins)
  );
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

// export
document.fetchFees = fetchFees;

// execute once
fetchFees();
