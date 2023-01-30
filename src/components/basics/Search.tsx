import { FC, ReactNode, useState } from "react";
import { Space, Input, Select, Button, Tooltip } from "antd";
import { AlignCenterOutlined, AlignLeftOutlined, MenuOutlined } from "@ant-design/icons";

const { Search: AntSearch } = Input;

const modes: Array<IMode> = [
  { title: "Cocok Sebagian", icon: <AlignCenterOutlined /> }, // Partial Match
  { title: "Cocok Dari Awal", icon: <AlignLeftOutlined /> },  // Match from Beginning
  { title: "Cocok Seluruh", icon: <MenuOutlined /> }          // Full Match
];

const Search: FC<ISearchProps> = props => {
  const { onSearch, searchBy, setSearchBy, columns } = props;
  const [currentMode, setCurrentMode] = useState(0);
  return (
    <Space>
      {(columns && searchBy && setSearchBy) && (
        <Select 
          defaultValue={searchBy}
          options={columns
            .filter(column => column.dataIndex)
            .map(column => ({ label: `Search by ${column.title}`, value: column.dataIndex }))
          }
          onChange={value => setSearchBy(value)}
          dropdownMatchSelectWidth={false} />
      )}
      {modes.map((mode, i) => (
        <Tooltip key={i} title={mode.title}>
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
  columns?: Array<any>
  searchBy?: string
  setSearchBy?: (searchBy: string) => void
}

interface IMode {
  title: string
  icon: ReactNode
}
