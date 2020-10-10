import "./styles.css";
import * as d3 from "d3";
import axios from "axios";

const appDiv = document.getElementById("app");

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

axios
  .get(url)
  .then((res) => {
    appDiv.innerText = "";
    buildBarChart(res.data.data);
  })
  .catch(function (error) {
    console.log(error);
  });

//d3 part here
const buildBarChart = (dataset) => {
  const w = 900;
  const h = 500;

  //yScale
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([0, h]);

  //xScale
  const years = dataset.map((d) => new Date(d[0]));
  const xScale = d3
    .scaleTime()
    .domain([d3.min(years), d3.max(years)])
    .range([0, w]);

  const app = d3.select("#app");

  //add title
  app
    .append("div")
    .attr("id", "title")
    .text("United States GDP")
    .style("font-size", "1.5rem")
    .style("padding", "1em")
    .style("color", "white");

  //append svg
  const svg = app.append("svg").attr("width", w).attr("height", h);

  //rect

  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d, i) => xScale(new Date(d[0])))
    .attr("y", h)
    .attr("width", w / dataset.length)
    .attr("height", 0)
    .attr("data-gdp", (d) => d[1])
    .attr("data-date", (d) => d[0])
    .attr("fill", "pink")
    .transition()
    .duration(750)
    .attr("y", (d) => h - yScale(d[1]))
    .attr("height", (d) => yScale(d[1]));

  //add x-axis
  const xAxisGenerator = d3.axisBottom(xScale);
  const xAxis = svg.append("g").attr("id", "x-axis").call(xAxisGenerator);

  //add y-axis
  const yAxisScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([h, 0]);
  const yAxisGenerator = d3.axisLeft(yAxisScale);
  const yAxis = svg.append("g").attr("id", "y-axis").call(yAxisGenerator);

  //add tooltip
  d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .attr("style", "position: absolute; opacity: 0;");

  d3.select("svg")
    .selectAll("rect")
    .data(dataset)
    .join("rect")
    .on("mouseover", function (d) {
      const myDate = d.target.getAttribute("data-date");
      d3.select("#tooltip")
        .transition()
        .duration(50)
        .style("opacity", 1)
        .style("left", d.x + 10 + "px")
        .style("top", d.y + 10 + "px")
        .text(
          `Date: ${myDate.slice(8, 10)}.${myDate.slice(5, 7)}.${myDate.slice(
            0,
            4
          )}
        GDP:${new Intl.NumberFormat("us-US", {
          style: "currency",
          currency: "USD"
        }).format(d.target.getAttribute("data-gdp"))}`
        )
        .attr("data-date", d.target.getAttribute("data-date"));
    })
    .on("mouseout", function () {
      d3.select("#tooltip").style("opacity", 0);
    })
    .on("mousemove", function (d) {
      d3.select("#tooltip")
        .style("left", d.x + 10 + "px")
        .style("top", d.y + 10 + "px");
    });
};
