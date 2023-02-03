import { FC, useState } from "react";
import { Space, Input, Select, Segmented, Tooltip } from "antd";
import { SegmentedLabeledOption } from "antd/lib/segmented";
import { AlignCenterOutlined, AlignLeftOutlined, FontColorsOutlined } from "@ant-design/icons";

const { Search: AntSearch } = Input;

// Creates a component pertaining a search bar with advanced features.

const modes: Array<SegmentedLabeledOption> = [
  { value: 'partial', icon: (   // Partial Match
    <Tooltip overlay="Match Sebagian">
      <AlignCenterOutlined />
    </Tooltip>
  )},
  { value: 'beginning', icon: ( // Match from Beginning
    <Tooltip overlay="Match Dari Awal">
      <AlignLeftOutlined /> 
    </Tooltip>
  )},
  { value: 'full', icon: (      // Full Match
    <Tooltip overlay="Match Seluruhnya">
      <FontColorsOutlined />
    </Tooltip>
  )}
];

const Search: FC<ISearchProps> = props => {
  const { onSearch, searchBy, setSearchBy, columns } = props;
  const [currentMode, setCurrentMode] = useState(modes[0].value);
  
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
      <Segmented options={modes} value={currentMode} onChange={setCurrentMode} />
      <AntSearch allowClear 
        placeholder="Cari" 
        style={{ width: 250 }} 
        onSearch={val => {
          switch (currentMode) {
            case 'partial':
              onSearch(new RegExp(val, 'i'));
              break;
            case 'beginning':
              onSearch(new RegExp('^' + val, 'i'));
              break;
            case 'full':
              onSearch(new RegExp('^' + val + '$', 'i'));
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
