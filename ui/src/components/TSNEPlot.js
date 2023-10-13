import React, { useEffect, useRef } from "react";
import '../assets/css/TSNEPlot.css'
import * as d3 from "d3";

function TSNEPlot({ data, compareData, tooltipRef }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (data && data.length > 0) {
      drawPlot(containerRef.current, data, compareData, tooltipRef.current);
    }
  }, [data, compareData, tooltipRef]);

  function drawPlot(container, data, compareData, tooltipRef) {
    const computedStyle = getComputedStyle(container);

    const width = parseInt(computedStyle.getPropertyValue("--svg-width"));
    const height = parseInt(computedStyle.getPropertyValue("--svg-height"));
    const margin = 20;


    const tooltip = d3.select(tooltipRef);

    d3.select(container).selectAll('*').remove();

    const svg = d3
      .select(container)
      .attr('viewBox', `0 0 ${width} ${height}`)

    const zoomableGroup = svg.append("g").attr("class", "zoomable-group");
    const zoom = d3.zoom()
      .scaleExtent([0.5, 20]) // Set the minimum and maximum zoom scale
      .on("zoom", (event) => {
        zoomableGroup.attr("transform", event.transform);
      });
    svg.call(zoom);

    const xScale = d3.scaleLinear().range([margin, width - margin]);
    const yScale = d3.scaleLinear().range([height - margin, margin]);

    const xExtent = d3.extent(data, (d) => d.reduced_coordinates[0]);
    const yExtent = d3.extent(data, (d) => d.reduced_coordinates[1]);

    xScale.domain(xExtent);
    yScale.domain(yExtent);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Display All Patents
    zoomableGroup
      .selectAll("circle.abstract")
      .data(data)
      .join("circle")
      .attr("class", "abstract")
      .attr("cx", (d) => xScale(d.reduced_coordinates[0]))
      .attr("cy", (d) => yScale(d.reduced_coordinates[1]))
      .attr("r", 2)
      .attr("fill", (d) => colorScale(d.code))
      .attr("opacity", 0.8)
      .attr("stroke", (d) =>
        (compareData && compareData.abstracts.some((neighbor) => neighbor.code === d.code)) ? "red" : "none") // TODO: this should not compare `code`, but some other method for finding similarity. Maybe the entire contents of the abstract for now? until we have proper ids?
      .attr("stroke-width", 1)
      .on("mouseover", (event, d) => {
        const tooltipHtml = `
          <p><strong>Code:</strong> ${d.code}</p>
          <p><strong>Code Value:</strong> ${d.code_value}</p>
          <p><strong>Abstract:</strong> ${d.abstract}</p>
        `;
        tooltip.html(tooltipHtml).style("opacity", 1);
        d3.select(event.currentTarget).attr("opacity", 1);
      })
      .on("mouseout", (event) => {
        const currentTarget = d3.select(event.currentTarget);
        if (currentTarget.attr("data-sticky") === null) {
          currentTarget.attr("opacity", 0.8);
        }
      })
      .on("click", (event) => {
        zoomableGroup.selectAll("circle[data-sticky]").attr("data-sticky", null).attr("opacity", 0.8);
        d3.select(event.currentTarget).attr("data-sticky", "true").attr("opacity", 1)
      });

    // Display Query
    if (compareData) {
      zoomableGroup
        .selectAll("circle.input-document")
        .data([compareData.input_document])
        .join("circle")
        .attr("class", "input-document")
        .attr("cx", (d) => xScale(d.reduced_coordinates[0]))
        .attr("cy", (d) => yScale(d.reduced_coordinates[1]))
        .attr("r", 10)
        .attr("fill", "#000")
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .attr("opacity", 0.8);
    }

  }

  return (
    <div className="svg-container">
      <svg ref={containerRef} className="svg-content"></svg>
    </div>
  );
}

export default TSNEPlot;
