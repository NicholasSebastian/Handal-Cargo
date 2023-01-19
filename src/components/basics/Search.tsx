import { FC, ReactNode, useState } from "react";
import { Space, Input, Button, Tooltip } from "antd";
import { AlignCenterOutlined, AlignLeftOutlined, MenuOutlined } from "@ant-design/icons";

const { Search: AntSearch } = Input;

// TODO: Search by selected column.

const modes: Array<IMode> = [
  { title: "Cocok Sebagian", icon: <AlignCenterOutlined /> }, // Partial Match
  { title: "Cocok Dari Awal", icon: <AlignLeftOutlined /> },  // Match from Beginning
  { title: "Cocok Seluruh", icon: <MenuOutlined /> }          // Full Match
];

const Search: FC<ISearchProps> = props => {
  const { onSearch } = props;
  const [currentMode, setCurrentMode] = useState(0);
  return (
    <Space>
      {modes.map((mode, i) => (
        <Tooltip title={mode.title}>
          <Button 
            icon={mode.icon} 
            type={(currentMode === i) ? 'primary' : 'default'} 
            onClick={() => setCurrentMode(i)} />
        </Tooltip>
      ))}
      <AntSearch allowClear 
        placeholder="Cari" 
        style={{ width: 250 }} 
        onSearch={val => {
          switch (currentMode) {
            case 0:
              onSearch(new RegExp(val));
              break;
            case 1:
              onSearch(new RegExp('^' + val));
              break;
            case 2:
              onSearch(new RegExp('^' + val + '$'));
              break;
          }
        }} />
    </Space>
  );
}

export default Search;

interface ISearchProps {
  onSearch: (query: RegExp) => void
}

interface IMode {
  title: string
  icon: ReactNode
}
