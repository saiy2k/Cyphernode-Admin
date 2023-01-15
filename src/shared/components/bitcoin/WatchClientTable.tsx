import React, { PropsWithChildren, useEffect, useState } from "react";

import { chakra, Flex, Select, useToast } from "@chakra-ui/react";

import {
  ColumnFiltersState,
  PaginationState,
  ColumnFilter,
  SortingState,
} from "@tanstack/react-table";
import { useErrorHandler, withErrorBoundary } from "react-error-boundary";

import {
  ClientCustomColumnDef,
  CustomColumnDef,
  Watch,
  WatchAddressPayload,
  WatchXPubPayload,
} from "@shared/types";
import { getCallProxy, postCallProxy } from "@shared/services/api";
import { ErrorBoundaryFallback } from "../ErrorBoundaryFallback";

import ServerDataTable, { FilterProps } from "../ServerDataTable";
import { WatchDetail } from "./WatchTableDetail";

import { DebouncedInput } from "shared/components/DebouncedInput";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import ClientDataTable from "../ClientDataTable";
import dayjs from "dayjs";

type BitcoinWatchTableProps = PropsWithChildren & {
  data: Watch[];
  isLoading: boolean;
  type: "address" | "xpub";

  onEdit?: (watchObject: Watch) => void;
  onUnWatch?: () => void;
};

export const BitcoinWatchTable = ({
  data,
  isLoading,
  onEdit,
  onUnWatch,
  type,
}: BitcoinWatchTableProps) => {
  const toast = useToast();

  const handleError = useErrorHandler();

  const [isUpdating, setIsUpdating] = useState(false);
  const [isUnWatching, setIsUnWatching] = useState(false);

  console.log("Render: BitcoinWatchTable");

  let columns: ClientCustomColumnDef<Watch>[] = [
    {
      id: "id",
      accessorKey: "id",
      header: () => <chakra.span> # </chakra.span>,
      cell: (info: any) => info.getValue(),
      width: "100px",
      enableColumnFilter: false,
      fieldType: "text",
    },
    {
      id: "address",
      accessorKey: "address",
      header: () => <span> Address </span>,
      cell: (info: any) => (info.getValue() as any).slice(0, 12) + "...",
      width: "auto",
      fieldType: "text",
    },
    {
      id: "label",
      accessorKey: "label",
      header: () => <span> Label </span>,
      cell: (info: any) => info.getValue(),
      width: "auto",
      fieldType: "text",
    },
  ];

  if(type === "xpub") {
    columns = columns.map(column => {
      if(column.id === "address") {
        return ({
          id: "address",
          accessorKey: "pub32",
          header: () => <span> Address </span>,
          cell: (info: any) => (info.getValue() as any).slice(0, 12) + "...",
          width: "auto",
          fieldType: "text",
        });
      }

      return column;
    });
  }

  const updateWatch = async (
    payload: WatchAddressPayload | WatchXPubPayload
  ) => {
    const endpoint = type === "address" ? "watch" : "watchxpub";

    setIsUpdating(true);
    try {
      const serverResp = await postCallProxy(endpoint, payload);
      console.log("serverResp", serverResp);
      if (!serverResp.ok) {
        let errorString = serverResp.status + ": " + serverResp.statusText;
        if (serverResp.body) {
          const serverError = await serverResp.json();
          errorString =
            errorString +
            ": " +
            (serverError.message
              ? serverError.message
              : JSON.stringify(serverError));
        }
        throw new Error(errorString);
      }
      // const response = await serverResp.json();
      toast({
        title: "Updated the watch",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      handleError(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const unWatchAddress = async (watchObject: WatchAddressPayload) => {
    setIsUnWatching(true);
    try {
      const serverResp = await postCallProxy("unwatch", watchObject);
      console.log("serverResp", serverResp);
      if (!serverResp.ok) {
        let errorString = serverResp.status + ": " + serverResp.statusText;
        if (serverResp.body) {
          const serverError = await serverResp.json();
          errorString =
            errorString +
            ": " +
            (serverError.message
              ? serverError.message
              : JSON.stringify(serverError));
        }
        throw new Error(errorString);
      }
      // const response = await serverResp.json();
      toast({
        title: "Unwatched",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      handleError(err);
    } finally {
      setIsUnWatching(false);
    }
  };

  const unWatchXpub = async (xpub: string) => {
    setIsUnWatching(true);
    try {
      const serverResp = await getCallProxy(`unwatchxpubbyxpub/${xpub}`);
      console.log("serverResp", serverResp);
      if (!serverResp.ok) {
        let errorString = serverResp.status + ": " + serverResp.statusText;
        if (serverResp.body) {
          const serverError = await serverResp.json();
          errorString =
            errorString +
            ": " +
            (serverError.message
              ? serverError.message
              : JSON.stringify(serverError));
        }
        throw new Error(errorString);
      }
      // const response = await serverResp.json();
      toast({
        title: "Unwatched",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      handleError(err);
    } finally {
      setIsUnWatching(false);
    }
  };

  return (
    <ClientDataTable
      data={data}
      isLoading={isLoading}
      columnDef={columns}
      columnsToHideInMobile={["amount"]}
      detailComp={(props) => (
        <WatchDetail
          {...props}
          isUpdating={isUpdating}
          isUnWatching={isUnWatching}
          type={type}
          onEdit={async (watchObject: Watch) => {
            await updateWatch(watchObject);

            if (onEdit) {
              onEdit(watchObject);
            }
            props.closeHandler();
          }}
          onUnWatch={async (watchObject: Watch) => {
            if (type === "address") {
              await unWatchAddress(watchObject);
            } else if (type === "xpub") {
              await unWatchXpub(watchObject.pub32!);
            }

            if (onUnWatch) {
              onUnWatch();
            }
            props.closeHandler();
          }}
        />
      )}
    />
  );
};

const BitcoinWatchTableWithErrorBoundary = withErrorBoundary(
  BitcoinWatchTable,
  {
    fallbackRender: (fallbackProps) => (
      <ErrorBoundaryFallback {...fallbackProps} title="Watch table" />
    ),
  }
);

export default BitcoinWatchTableWithErrorBoundary;
