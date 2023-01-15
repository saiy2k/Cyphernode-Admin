import React from "react"

import {
    useDisclosure,
    Button,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter
} from "@chakra-ui/react"

type ConfirmationDialogProps = {
    deleteTrigger: any,
    title: string,
    message: string,
    onDialogClose: (confirm: boolean) => void,
};

export default function ConfirmationDialog({
    deleteTrigger: DeleteTrigger,
    title,
    message,
    onDialogClose,
}: ConfirmationDialogProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef(null);

    return (
      <>
        <DeleteTrigger colorScheme='red' onClick={onOpen} />

        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
                {
                    title
                    ? (
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            {title}
                        </AlertDialogHeader>
                      )
                    : null
                }
              <AlertDialogBody>
                {message}
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={() => {
                    onDialogClose(false);
                    onClose();
                }}>
                  No
                </Button>
                <Button colorScheme='red' onClick={() => {
                    onDialogClose(true);
                    onClose();
                }} ml={3}>
                  Yes
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    )
  }