import React from "react";
import "antd/dist/antd.css";

import { Table } from "antd";
import {
  sortableContainer,
  sortableElement,
  sortableHandle
} from "react-sortable-hoc";
import { MenuOutlined } from "@ant-design/icons";

export default function App() {
  return <SortableTable />;
}

const data = [
  {
    key: "1",
    name: "Mobility",
    index: 0
  },
  {
    key: "2",
    name: "Resilience",
    index: 1
  },
  {
    key: "3",
    name: "Discipline",
    index: 2
  },
  {
    key: "4",
    name: "Strength",
    index: 3
  }
];

const DragHandle = sortableHandle(({ active }) => (
  <MenuOutlined style={{ cursor: "grab", color: active ? "blue" : "#999" }} />
));

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

function SortableTable() {
  const [dataSource, setDataSource] = React.useState(data);
  const [selectedItems, setSelectedItems] = React.useState([]);

  const getColumns = () => {
    return [
      {
        title: "Sort",
        dataIndex: "",
        width: 30,
        className: "drag-visible",
        render: (d, dd, i) => (
          <>
            <DragHandle active={selectedItems.includes(i)} />
          </>
        )
      },
      {
        title: "Name",
        dataIndex: "name",
        className: "drag-visible"
      }
    ];
  };
  const merge = (a, b, i = 0) => {
    let aa = [...a];
    return [...a.slice(0, i), ...b, ...aa.slice(i, aa.length)];
  };
  const onSortEnd = ({ oldIndex, newIndex }) => {
    let tempDataSource = dataSource;

    if (oldIndex !== newIndex) {
      if (!selectedItems.length) {
        let movingItem = tempDataSource[oldIndex];
        tempDataSource.splice(oldIndex, 1);
        tempDataSource = merge(tempDataSource, [movingItem], newIndex);
      } else {
        let filteredItems = [];
        selectedItems.forEach((d) => {
          filteredItems.push(tempDataSource[d]);
        });
        let newData = [];
        tempDataSource.forEach((d, i) => {
          if (!selectedItems.includes(i)) {
            newData.push(d);
          }
        });
        tempDataSource = [...newData];
        tempDataSource = merge(tempDataSource, filteredItems, newIndex);
      }
      setDataSource(tempDataSource);
      setSelectedItems([]);
    }
  };

  const DraggableContainer = (props) => (
    <SortableContainer
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex(
      (x) => x.index === restProps["data-row-key"]
    );
    return (
      <SortableItem
        index={index}
        {...restProps}
        selected={selectedItems.length}
        onClick={(e) => {
          if (e.ctrlKey || e.metaKey) {
            selectedItems.includes(index)
              ? selectedItems.splice(selectedItems.indexOf(index), 1)
              : selectedItems.push(index);
            setSelectedItems(selectedItems);
          } else {
            setSelectedItems([]);
          }
        }}
      />
    );
  };

  return (
    <>
      <Table
        pagination={false}
        dataSource={dataSource}
        columns={getColumns()}
        rowKey="index"
        components={{
          body: {
            wrapper: DraggableContainer,
            row: DraggableBodyRow
          }
        }}
      />
      {selectedItems.length ? <>{selectedItems.length} items selected </> : ""}
    </>
  );
}
