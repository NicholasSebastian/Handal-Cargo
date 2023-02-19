import { FC, useState } from "react";
import { Space, Input, Select, Segmented, Tooltip } from "antd";
import { SegmentedLabeledOption } from "antd/lib/segmented";
import { AlignCenterOutlined, AlignLeftOutlined, FontColorsOutlined } from "@ant-design/icons";

const { Search: AntSearch } = Input;

// Creates a component pertaining a search bar with advanced features.

function columnsToOptions(columns: any): SearchOptions {
  return columns.map((column: any) => ({ key: column.dataIndex, label: column.title }));
}

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
  const { onSearch, searchBy, setSearchBy, searchOptions } = props;
  const [currentMode, setCurrentMode] = useState(modes[0].value);
  
  return (
    <Space>
      {(searchOptions && searchBy && setSearchBy) && (
        <Select 
          defaultValue={searchBy}
          options={searchOptions
            .filter(searchOption => searchOption.key)
            .map(searchOption => ({ 
              key: searchOption.key, 
              value: searchOption.key, 
              label: `Search by ${searchOption.label}` 
            }))
          }
          onChange={value => setSearchBy(value)}
          dropdownMatchSelectWidth={false} />
      )}
      <Segmented options={modes} value={currentMode} onChange={setCurrentMode} />
      <AntSearch allowClear 
        placeholder="Cari" 
        style={{ width: 250 }} 
        onSearch={val => {
          if (val.length === 0) onSearch(undefined);
          else {
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
          }
        }} />
    </Space>
  );
}

export type SearchOptions = Array<SearchOption>;
export { columnsToOptions };
export default Search;

interface ISearchProps {
  onSearch: (query: RegExp | undefined) => void
  searchOptions?: Array<SearchOption>
  searchBy?: string
  setSearchBy?: (searchBy: string) => void
}

interface SearchOption {
  key: string
  label: string
}
