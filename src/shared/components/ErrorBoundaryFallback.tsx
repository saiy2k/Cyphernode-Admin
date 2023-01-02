import React, { PropsWithChildren } from "react"
;
import { Button, Text } from "@chakra-ui/react";
import { FallbackProps } from "react-error-boundary";

import { Widget } from ".";

type Props = PropsWithChildren & FallbackProps & {
  title?: string,
  removeWidget?: boolean,
};

export function ErrorBoundaryFallback(props: Props) {
  const { error, resetErrorBoundary, title, removeWidget } = props;

  const Wrapper = !removeWidget ? Widget: React.Fragment;

  return (
    <Wrapper variant='border'>
      {
        title
        ?
        <Text fontWeight='bold'>{title}</Text>
        :
        null
      }
      <Text color='red' marginY='10px' lineHeight='16px'>{error.message}</Text>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </Wrapper>
  );
}
