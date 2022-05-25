const Influx = require("influx");

let data = [];
const request = require("request");
const url = "https://api.covid19india.org/data.json";
request({ url: url }, (error, response) => {
  data = JSON.parse(response.body)["cases_time_series"];
  console.log(data[0]);
  loadData();
});

const client = new Influx.InfluxDB({
  database: "ojas_db",
  host: "localhost",
  port: 8086,
  username: "ojas",
  password: "ojas1234",
});

var points = [];
loadData = async () => {
  try {
    const rows = data.map((x) => {
      return {
        measurement: "covid_cases",
        fields: {
          dailyconfirmed: Number(x.dailyconfirmed),
          dailydeceased: Number(x.dailydeceased),
          dailyrecovered: Number(x.dailyrecovered),
          date: x.date,
          totalconfirmed: Number(x.totalconfirmed),
          totaldeceased: Number(x.totaldeceased),
          totalrecovered: Number(x.totalrecovered),
        },
        timestamp: new Date(x.date).getTime(),
      };
    });

    await client.writePoints(rows);
  } catch (err) {
    console.log(`Error while processing ${err}`);
  }
};
