import { Select, Flex } from "@chakra-ui/react";
import { CustomColumnDef } from "@shared/types";
import { Column } from "@tanstack/react-table";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { PropsWithChildren, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { DebouncedInput } from "../DebouncedInput";

export type ClientDataTableFilterProps<T> = PropsWithChildren & {
  column: Column<any, unknown>,
  loading?: boolean
};

export default function ClientDataTableFilter<T>({
  column,
  loading,
}: ClientDataTableFilterProps<T>) {

  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const disabled = loading;

  const columnDef = (column.columnDef as CustomColumnDef<T>);
  const columnFilterValue = column.getFilterValue();

  return columnDef.fieldType === "select"
    ? (
      <div style={{ marginLeft: '20px', marginRight: '20px' }}>
        <Select
          disabled={disabled}
          placeholder='Select a value'
          onChange={(e) => {
            column.setFilterValue(e.target.value);
          }}
          width={{base: '175px', md: '175px'}}
        >
          {
            columnDef.options?.map(option => <option key={option.id}>{option.text}</option>)
          }
        </Select>
      </div>
    )
    : columnDef.fieldType === 'number' ? (
      <div style={{ marginLeft: '20px', marginRight: '20px' }}>
        <Flex gap={'10px'} className="flex space-x-2" justifyContent='center' marginLeft='20px'>
          <DebouncedInput
            disabled={disabled}
            type="number"
            width={{base: '100px', md: '82px'}}
            min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
            max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
            value={(columnFilterValue as [number, number])?.[0] ?? ''}
            onChange={value =>{
              column.setFilterValue((old: [number, number]) => [value, old?.[1]])
            }
            }
            placeholder={`Min ${
              column.getFacetedMinMaxValues()?.[0]
                ? `(${column.getFacetedMinMaxValues()?.[0]})`
                : ''
            }`}
            className="w-24 border shadow rounded"
          />
          <DebouncedInput
            disabled={disabled}
            width={{base: '100px', md: '82px'}}
            type="number"
            min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
            max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
            value={(columnFilterValue as [number, number])?.[1] ?? ''}
            onChange={value =>{
              column.setFilterValue((old: [number, number]) => [old?.[0], value])
            }
            }
            placeholder={`Max ${
              column.getFacetedMinMaxValues()?.[1]
                ? `(${column.getFacetedMinMaxValues()?.[1]})`
                : ''
            }`}
            className="w-24 border shadow rounded"
          />
        </Flex>
        <div className="h-1" />
      </div>
    ) : columnDef.fieldType === "date" ? (
      <div style={{ marginLeft: '20px', marginRight: '20px', position: 'relative' }}>
        <RangeDatepicker
          disabled={disabled}
          propsConfigs={{
            inputProps: {
              width: '240px',
                placeholder: 'Select a date range'
            }
          }}
          selectedDates={selectedDates}
          onDateChange={(selectedDateRange: Date[]) => {
            let dates = selectedDateRange;

            if(selectedDateRange.length === 1) {
              dates = [selectedDateRange[0], new Date()];
            }

            column.setFilterValue(() => dates.map((date: Date) => (date.valueOf())));
            setSelectedDates(selectedDateRange);
          }}
        />
        {
          selectedDates.length === 0
          ? null
          : (
            <span
              style={{
                position: 'absolute',
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: 'pointer',
              }}
              onClick={() => {
                setSelectedDates([]);
                column.setFilterValue(() => []);
              }}
            >
              <IoCloseCircleOutline />
            </span>
          )
        }
        <div className="h-1" />
      </div>
    ) : (
      <div style={{ marginLeft: '20px', marginRight: '20px' }}>
        <DebouncedInput
          disabled={disabled}
          width={{base: '150px', md: '200px'}}
          type="text"
          value={(columnFilterValue ?? '') as string}
          onChange={value => {
            column.setFilterValue(value)
          }}
          placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
          className="w-36 border shadow rounded"
          list={column.id + 'list'}
        />
        <div className="h-1" />
      </div>
    );
}
