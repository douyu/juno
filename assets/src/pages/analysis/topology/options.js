// 简单关系图示例 option
var json = {
  nodes: [
    { id: '10047', label: 'roombase', size: 20, x: 10, y: 0, color: 'red' },
    { id: '10089', label: 'room-go', size: 20, x: 130, y: 30, color: 'red' },
    { id: '10039', label: 'play-go', size: 20, x: 160, y: 60, color: 'green' },
    { id: '10023', label: 'C++', size: 20, x: 180, y: 80, color: 'blue' },
    { id: '10053', label: 'Java', size: 20, x: 190, y: 30, color: 'blue' },
  ],
  edges: [
    { sourceID: '10089', targetID: '10047' },
    { sourceID: '10039', targetID: '10089' },
    { sourceID: '10039', targetID: '10047' },
    { sourceID: '10023', targetID: '10053' },
  ],
};

// npm 依赖图示例 option
export const npmDependencies = {
  title: {
    text: 'Service Dependencies',
  },
  animationDurationUpdate: 1500,
  animationEasingUpdate: 'quinticInOut',
  series: [
    {
      type: 'graph',
      layout: 'none',
      // progressiveThreshold: 700,
      // left: 10,
      // top: 10,
      // json.nodes
      data: json.nodes.map(function (node) {
        return {
          x: node.x,
          y: node.y,
          id: node.id,
          name: node.label,
          symbolSize: node.size,
          itemStyle: {
            normal: {
              color: node.color,
            },
          },
        };
      }),
      // json.edges
      edges: json.edges.map(function (edge) {
        return {
          source: edge.sourceID,
          target: edge.targetID,
        };
      }),
      label: {
        normal: {
          position: 'right',
          show: true,
        },
      },
      edgeSymbol: ['circle', 'arrow'],
      edgeSymbolSize: [3, 10],
      edgeLabel: {
        normal: {
          textStyle: {
            fontSize: 20,
          },
        },
      },
      roam: true,
      focusNodeAdjacency: true,
      lineStyle: {
        normal: {
          color: 'black',
          width: 0.5,
          curveness: 0.3,
          opacity: 1,
        },
      },
    },
  ],
};

// 安排好节点
const cacl_nodes = (relations) => {
  let nodes = {};
  relations.forEach((el) => {
    if (nodes[el.source] == undefined) {
      nodes[el.source] = 0;
    }
    if (nodes[el.target] == undefined) {
      nodes[el.target] = 0;
    }
    nodes[el.target] += 1;
  });
  return Object.keys(nodes)
    .sort((a, b) => nodes[b].length - nodes[a].length)
    .map((el, i) => {
      let x = (i % 10) * 30;
      let y = (i % 10) * 20;
      return {
        x: x,
        y: y,
        id: el,
        name: el,
        symbolSize: nodes[el] * 0.89 + 20,
        itemStyle: {
          color: '#1890ff',
        },
      };
    });
};

export const parse_nodes = (relations) => {
  let nodes = {};
  relations.forEach((el) => {
    if (nodes[el.source] == undefined) {
      nodes[el.source] = 1;
    }
    // 兼容某些target仅处于被调用状态
    if (nodes[el.target] == undefined) {
      nodes[el.target] = 1;
    }
  });
  return Object.keys(nodes).map((el) => el);
};

// douyu 微服务依赖拓扑图 options 生成函数
/*
 * params:
 *      relation // eg. [{aid: 10047, source: 'roombase', target: 'play-go', name: ''}]
 *      node // if click a node in view
 */
export const render_options = (relations, node = null) => {
  let node_ups_and_downs = [];
  relations.forEach((el) => {
    if (el.target == node) {
      node_ups_and_downs.push(el.source);
    } else if (el.source == node) {
      node_ups_and_downs.push(el.target);
    }
  });
  // return npmDependencies
  const nodes = cacl_nodes(relations).map((el) => {
    if (node == null) {
      return opacity_node(el, 0.8);
    }
    if (!node_ups_and_downs.includes(el.name) && el.name != node) {
      return opacity_node(el, 0.1);
    }
    return opacity_node(el, 1);
  });
  const edges = relations.map((el) => {
    let edge = { source: el.source, target: el.target };
    if (node == null) {
      return opacity_edge(edge, 0.5);
    }
    if (el.target !== node && el.source !== node) {
      return opacity_edge(edge, 0.1);
    }
    return opacity_edge(edge, 1);
  });
  return {
    backgroundColor: '#f3f3f3',
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    legendHoverLink: false,
    series: [
      {
        type: 'graph',
        layout: 'force',
        force: {
          repulsion: [90, 200, 560, 830],
        },
        data: nodes,
        edges: edges,
        label: {
          normal: {
            position: 'top',
            show: true,
          },
        },
        edgeSymbol: ['circle', 'arrow'],
        edgeSymbolSize: [3, 10],
        edgeLabel: {
          normal: {
            textStyle: {
              fontSize: 20,
            },
          },
        },
        roam: true,
        // draggable: true,
        lineStyle: {
          normal: {
            color: '#666',
            width: 0.5,
            curveness: 0.2,
            opacity: 0.4,
          },
        },
      },
    ],
  };
};

const opacity_node = (node, op) =>
  Object.assign(node, {
    itemStyle: {
      color: '#1890ff',
      opacity: op,
    },
  });

const opacity_edge = (edge, op) =>
  Object.assign(edge, {
    lineStyle: {
      color: 'black',
      opacity: op,
    },
  });

export const render_options_of_node = (relations, node) => {
  let ups = [];
  let downs = [];
  relations.forEach((el) => {
    if (el.source === node) {
      downs.push(el.target);
      return;
    }
    if (el.target === node) {
      ups.push(el.source);
    }
  });
  const nodes = level_nodes(Array.from(new Set(ups)), node, Array.from(new Set(downs)));
  const edges = relations
    .filter((el) => el.target == node || el.source == node)
    .map((el) => {
      return {
        source: el.source,
        target: el.target,
        lineStyle: {
          color: '#666',
          width: 0.5,
          curveness: 0,
        },
      };
    });
  // console.log(nodes, edges)
  return {
    backgroundColor: '#f3f3f3',
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    legendHoverLink: false,
    series: [
      {
        type: 'graph',
        layout: 'none',
        data: nodes,
        edges: edges,
        label: {
          normal: {
            position: 'top',
            show: true,
          },
        },
        edgeSymbol: ['circle', 'arrow'],
        edgeSymbolSize: [3, 10],
        edgeLabel: {
          normal: {
            textStyle: {
              fontSize: 20,
            },
          },
        },
        roam: true,
      },
    ],
  };
};

// 分层安排节点
const level_nodes = (ups, node, downs) => {
  let x = 400;
  let y = 300;
  let nodes = [
    {
      x: x,
      y: y,
      id: node,
      fixed: true,
      name: node,
      symbolSize: 40,
      itemStyle: {
        color: '#1890ff',
      },
    },
  ];
  let ups_idx = ups.map((_, i) => i);
  ups_idx.forEach((i) => {
    if (i <= 1) {
      return;
    }
    if (i >= 8) {
      ups_idx[i] = ups_idx[i - 8];
      return;
    }
    ups_idx[i] = i % 2 == 0 ? ups_idx[i - 2] - 1 : ups_idx[i - 2] + 1;
  });
  nodes = nodes.concat(
    ups.map((el, i) => ({
      x: x + ups_idx[i] * 100, // x + ((-1)**(i%2+1))*(i-i%2+1)*100
      y: y - 120 - Math.floor(i / 8) * 40,
      id: el,
      name: el,
      symbolSize: 20,
      itemStyle: {
        color: '#1890ff',
      },
    })),
  );
  let downs_idx = downs.map((_, i) => i);
  downs_idx.forEach((i) => {
    if (i <= 1) {
      return;
    }
    if (i >= 8) {
      downs_idx[i] = downs_idx[i - 8];
      return;
    }
    downs_idx[i] = i % 2 == 0 ? downs_idx[i - 2] - 1 : downs_idx[i - 2] + 1;
  });
  nodes = nodes.concat(
    downs.map((el, i) => ({
      x: x + downs_idx[i] * 100,
      y: y + 120 + Math.floor(i / 8) * 40,
      id: el,
      name: el,
      symbolSize: 20,
      itemStyle: {
        color: '#1890ff',
      },
    })),
  );
  return nodes;
};
