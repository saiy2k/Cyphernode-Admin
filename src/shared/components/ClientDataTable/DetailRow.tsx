import { Select, Input, Box, Text, Flex } from "@chakra-ui/react";
import { textStyles } from "@theme/customStyles";
import { PropsWithChildren } from "react";

const textOverflowStyle = {
  textOverflow: 'ellipsis',
  overflow: 'hidden',
};

export type DetailRowData = {
    _key: string,
    title: string,
    value: any,
    textComponent: (props: any) => JSX.Element,
    type: React.HTMLInputTypeAttribute | "select",
    options?: DropDownOption[],
    nonEditable?: boolean,
  }
  
  type DetailRowProps = DetailRowData & {
    editMode?: boolean,
    onChange: (key: string, value: any) => void,
  };
  
  export default function DetailRow({
    _key,
    title,
    value,
    type,
    textComponent: TextComponent,
    editMode,
    onChange,
    options,
    nonEditable,
  }: DetailRowProps) {
  
    const onValueChange = (value: any) => {
      onChange(_key, value)
    };
  
    return (
      <Box mb={2} flex={1}>
        {
          editMode && !nonEditable
          ? <DetailRowInput type={type} value={value} onChange={onValueChange} options={options} />
          : (
              <Flex justifyContent='center' flexDirection='column' textAlign='start'>
                <b> {title} </b>
                <Box
                  whiteSpace={{base: 'nowrap', md: 'normal'}}
                  overflow={{base: 'hidden', md: 'unset'}}
                  maxWidth={{
                    base: 'calc(100vw - 85px);', // 85px = ((20px [padding] + 20px [padding]) * 2) + 5px [extra space]
                    md: '500px'
                  }}
                  textOverflow='ellipsis' {...textStyles.body}
                >
                  {<TextComponent {...textOverflowStyle} />}
                </Box>
              </Flex>
            )
        }
      </Box>
    );
  }
  
  type DropDownOption = {
    id: any,
    value: any,
  };
  
  type DetailRowInputProps = PropsWithChildren & {
    type: React.HTMLInputTypeAttribute,
    options?: DropDownOption[],
    onChange: (value: any) => void,
    value: any,
  };
  
  function DetailRowInput({
    type,
    options = [],
    onChange = () => {},
    value,
  }: DetailRowInputProps) {
  
    if(type === "select") {
      return (
        <Select onChange={(e) => onChange(e.target.value)} value={value}>
          {
            options.map(option => (<option key={option.id} value={option.id}>{option.value}</option>))
          }
        </Select>
      );
    } else {
      return (
        <Input type={type} onChange={(e) => onChange(e.target.value)} value={value} />
      );
    }
  }