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
    var sameAmount = form["sameAmount"].checked;
    if (price == null || price == "") {
      return false;
    } else {
      if (sameAmount) {
        const txCosts = fee * bytes;
        const rewardsInSat = rewards * price;

        const numberOfMiners = Math.floor(rewardsInSat / (commit + txCosts));
        console.log({ numberOfMiners });
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
      } else {
        const profit = 0;
      }
      return true;
    }
  };
});
