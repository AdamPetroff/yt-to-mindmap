import * as d3 from "d3";
import { useRef, useEffect, useCallback } from "react";
import { useQuery } from "react-query";

export function D3Wrapper() {
  const vidId = "2NZMaI-HeNU";

  // const data = _data;
  const { data } = useQuery(["getFlow", vidId], async () => {
    console.log(vidId);
    const res = await fetch(`/api/mindmap-data/${vidId}`);
    return (await res.json()) as { nodes: any[]; edges: any[] };
  });

  const nodeHoverTooltip = useCallback((node: any) => {
    return `<div>     
      <b>${node.name}</b>
    </div>`;
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <ForceGraph
      linksData={data.links.map((d) => ({ ...d, value: 40 }))}
      nodesData={data.nodes}
      nodeHoverTooltip={nodeHoverTooltip}
    />
  );
}

export function ForceGraph({
  linksData,
  nodesData,
  nodeHoverTooltip,
}: {
  linksData: any[];
  nodesData: any[];
  nodeHoverTooltip: any;
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    let destroyFn;

    if (containerRef.current) {
      const { destroy } = runForceGraph(
        containerRef.current,
        linksData,
        nodesData,
        nodeHoverTooltip
      );
      destroyFn = destroy;
    }

    return destroyFn;
  }, []);

  return (
    <div ref={containerRef} className={"w-full h-[80vh] bg-white relative"} />
  );
}

export function runForceGraph(
  container: HTMLElement,
  linksData: any[],
  nodesData: any[],
  nodeHoverTooltip: any
) {
  const links = linksData.map((d) => Object.assign({}, d));
  const nodes = nodesData.map((d) => Object.assign({}, d));

  console.log({ links, nodes });

  const containerRect = container.getBoundingClientRect();
  const height = containerRect.height;
  const width = containerRect.width;

  const color = () => {
    return "#9D00A0";
  };

  const icon = (d) => {
    return d.label;
  };

  const getClass = (d) => {
    return d.gender === "male" ? "bg-red-500" : "bg-blue-500";
  };

  const drag = (simulation: d3.Simulation<any, any>) => {
    const dragstarted = (d: any) => {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    };

    const dragged = (d) => {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    };

    const dragended = (d) => {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };

  // Add the tooltip element to the graph
  const tooltip = document.querySelector("#graph-tooltip");
  if (!tooltip) {
    const tooltipDiv = document.createElement("div");
    // tooltipDiv.classList.add(styles.tooltip);
    tooltipDiv.style.opacity = "0";
    tooltipDiv.id = "graph-tooltip";
    document.body.appendChild(tooltipDiv);
  }
  const div = d3.select("#graph-tooltip");

  const addTooltip = (hoverTooltip, d, x, y) => {
    div.transition().duration(200).style("opacity", 0.9);
    div
      .html(hoverTooltip(d))
      .style("left", `${x}px`)
      .style("top", `${y - 28}px`);
  };

  const removeTooltip = () => {
    div.transition().duration(200).style("opacity", 0);
  };

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .distance(50)
        .id((d) => {
          console.log(d);
          return d.id;
        })
    )
    .force("charge", d3.forceManyBody().strength(-1500))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .call(
      d3.zoom().on("zoom", function () {
        svg.attr("transform", d3.event.transform);
      })
    );

  const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", (d) => Math.sqrt(d.value));

  const node = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", 50)
    .attr("fill", color)
    .call(drag(simulation));

  const label = svg
    .append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .attr("class", (d) => `fa ${getClass(d)}`)
    .text((d) => {
      return icon(d);
    })
    .call(drag(simulation));

  label
    .on("mouseover", (d) => {
      addTooltip(nodeHoverTooltip, d, d3.event.pageX, d3.event.pageY);
    })
    .on("mouseout", () => {
      removeTooltip();
    });

  simulation.on("tick", () => {
    //update link positions
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    // update node positions
    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    // update label positions
    label
      .attr("x", (d) => {
        return d.x;
      })
      .attr("y", (d) => {
        return d.y;
      });
  });

  return {
    destroy: () => {
      simulation.stop();
    },
    nodes: () => {
      return svg.node();
    },
  };
}
