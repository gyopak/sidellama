import React, { ForwardedRef, forwardRef, useEffect, useState } from 'react';
import ResizeTextarea from 'react-textarea-autosize';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
  useDisclosure
} from '@chakra-ui/react';

import { useConfig } from './ConfigContext';
import { SettingTitle } from './SettingsTitle';

const AutoResizeTextarea = forwardRef((props, ref) => (
  <Textarea
    as={ResizeTextarea}
    maxRows={8}
    minH="unset"
    minRows={3}
    overflow="scroll"
    ref={ref as ForwardedRef<HTMLTextAreaElement>}
    resize="none"
    w="100%"
    {...props}
  />
));

const SaveButtons = ({ hasChange, buttonColor, onSave, onSaveAs, onCancel }) => {
  const commonButtonStyles = {
    _hover: { background: 'var(--active)', border: `2px solid ${buttonColor}` },
    background: 'var(--active)',
    border: `2px solid ${buttonColor}`,
    borderRadius: 16,
    color: buttonColor,
    size: 'sm',
    mr: 2
  };

  return (
    <Box display="flex" mt={2}>
      {hasChange && (
        <>
          <Button {...commonButtonStyles} disabled={!hasChange} onClick={onSave}>
            save
          </Button>
          <Button {...commonButtonStyles} disabled={!hasChange} onClick={onSaveAs}>
            save as..
          </Button>
          <Button
            _hover={{ background: 'var(--active)', border: '2px solid var(--text)' }}
            background="var(--bg)"
            border="2px solid var(--text)"
            borderRadius={16}
            color="var(--text)"
            mr={2}
            size="sm"
            onClick={onCancel}
          >
            cancel
          </Button>
        </>
      )}
    </Box>
  );
};

const PersonaModal = ({ isOpen, onClose, personaPrompt, personas, updateConfig }) => {
  const [name, setName] = useState('');
  const buttonColor = name ? 'var(--text)' : 'gray';

  const handleCreate = () => {
    if (!name) return;
    updateConfig({
      personas: { ...personas, [name]: personaPrompt },
      persona: name
    });

    setName('');
    onClose();
  };

  return (
    <Modal isCentered isOpen={isOpen} size="xs" onClose={onClose}>
      <ModalOverlay />
      <ModalContent background="var(--active)" borderRadius={16}>
        <ModalHeader color="var(--text)" padding={2} paddingLeft={6}>
          create new persona
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody padding={4}>
          <Input
            _focus={{ borderColor: 'var(--text)', boxShadow: 'none !important' }}
            _hover={{ borderColor: 'var(--text)', boxShadow: 'none !important' }}
            background="var(--bg)"
            border="2px"
            borderColor="var(--text)"
            borderRadius={16}
            color="var(--text)"
            fontSize="md"
            fontStyle="bold"
            fontWeight={600}
            mr={4}
            placeholder="name"
            size="md"
            value={name}
            variant="outline"
            onChange={e => setName(e.target.value)}
          />
        </ModalBody>
        <ModalFooter justifyContent="center" pt={0}>
          <Button
            _hover={{ background: 'var(--bg)', border: `2px solid ${buttonColor}` }}
            background="var(--bg)"
            border={`2px solid ${buttonColor}`}
            borderRadius={16}
            color={buttonColor}
            disabled={!name}
            mr={2}
            size="sm"
            onClick={handleCreate}
          >
            create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const DeleteModal = ({ isOpen, onClose, persona, personas, updateConfig }) => {
  const handleDelete = () => {
    const newPersonas = { ...personas };
    delete newPersonas[persona];
    updateConfig({
      personas: newPersonas,
      persona: Object.keys(newPersonas)[0]
    });

    onClose();
  };

  return (
    <Modal isCentered isOpen={isOpen} size="xs" onClose={onClose}>
      <ModalOverlay />
      <ModalContent background="var(--active)" borderRadius={16}>
        <ModalHeader padding={2} paddingLeft={6}>
          delete
          {' '}
          {persona}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody padding={2} />
        <ModalFooter justifyContent="center" pt={0}>
          <Button
            _hover={{ background: 'var(--bg)', border: '2px solid var(--text)' }}
            background="var(--bg)"
            border="2px solid var(--text)"
            borderRadius={16}
            color="var(--text)"
            mr={2}
            size="sm"
            onClick={handleDelete}
          >
            delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const PersonaSelect = ({ personas, persona, updateConfig }) => (
  <Select
    _focus={{ borderColor: 'var(--text)', boxShadow: 'none !important' }}
    _hover={{ borderColor: 'var(--text)', boxShadow: 'none !important' }}
    border="2px"
    borderColor="var(--text)"
    borderRadius={16}
    color="var(--text)"
    defaultValue="default"
    fontSize="md"
    fontStyle="bold"
    fontWeight={600}
    maxWidth="50%"
    mb={2}
    ml={1}
    size="sm"
    value={persona}
    onChange={e => updateConfig({ persona: e.target.value })}
  >
    {Object.keys(personas).map(p => (
      <option key={p} value={p}>{p}</option>
    ))}
  </Select>
);

const PersonaTextarea = ({ personaPrompt, setPersonaPrompt }) => (
  <AutoResizeTextarea

    // @ts-ignore
    // eslint-disable-next-line react/jsx-props-no-multi-spaces
    _focus={{ borderColor: 'var(--text)', boxShadow: 'none !important' }}
    _hover={{ borderColor: 'var(--text)', boxShadow: 'none !important' }}
    background="var(--text)"
    border="2px"
    borderColor="var(--text)"
    borderRadius={16}
    boxShadow="none !important"
    color="var(--bg)"
    fontSize="md"
    fontStyle="bold"
    fontWeight={600}
    value={personaPrompt}
    onChange={e => setPersonaPrompt(e.target.value)}
  />
);

const SaveButtonsWrapper = ({ buttonColor, hasChange, defaultPrompt, setPersonaPrompt, updateConfig, personas, persona, onOpen, personaPrompt }) => (
  <SaveButtons
    buttonColor={buttonColor}
    hasChange={hasChange}
    onCancel={() => setPersonaPrompt(defaultPrompt)}
    onSave={() => updateConfig({ personas: { ...personas, [persona]: personaPrompt } })}
    onSaveAs={onOpen}
  />
);

const PersonaModalWrapper = ({ isOpen, personaPrompt, personas, updateConfig, onClose }) => (
  <PersonaModal
    isOpen={isOpen}
    personaPrompt={personaPrompt}
    personas={personas}
    updateConfig={updateConfig}
    onClose={onClose}
  />
);

const DeleteModalWrapper = ({ isDeleteOpen, persona, personas, updateConfig, onDeleteClose }) => (
  <DeleteModal
    isOpen={isDeleteOpen}
    persona={persona}
    personas={personas}
    updateConfig={updateConfig}
    onClose={onDeleteClose}
  />
);

const Persona = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [name, setName] = useState('');
  const { config, updateConfig } = useConfig();
  const personas = config?.personas || {};
  const persona = config?.persona || 'sidellama';

  const defaultPrompt = personas?.[persona] || personas?.sidellama;
  const [personaPrompt, setPersonaPrompt] = useState(defaultPrompt);
  const hasChange = personaPrompt !== defaultPrompt;

  useEffect(() => {
    if (defaultPrompt !== personaPrompt) {
      setPersonaPrompt(defaultPrompt);
    }
  }, [defaultPrompt]);

  const buttonColor = hasChange ? 'var(--text)' : 'gray';

  return (
    <AccordionItem
      border="2px solid var(--text)"
      borderBottomWidth="2px !important"
      borderRadius={16}
      mb={4}
    >
      <AccordionButton _hover={{ backgroundColor: 'transparent' }} paddingBottom={1} paddingRight={2}>
        <SettingTitle
          icon="👤"
          padding={0}
          text="persona"
        />
      </AccordionButton>
      <AccordionPanel p={2} pt={2}>
        <Box display="flex" flexWrap="wrap">
          <PersonaSelect persona={persona} personas={personas} updateConfig={updateConfig} />
          {Object.keys(personas).length > 1 && (
            <IconButton
              aria-label="delete"
              borderRadius={16}
              icon={<DeleteIcon color="var(--text)" fontSize="xl" />}
              pb={2}
              variant="outlined"
              onClick={onDeleteOpen}
            />
          )}
          <IconButton
            aria-label="delete"
            borderRadius={16}
            icon={<AddIcon color="var(--text)" fontSize="xl" />}
            pb={2}
            variant="outlined"
            onClick={() => {
              setPersonaPrompt('');
              onOpen();
            }}
          />
          <PersonaTextarea personaPrompt={personaPrompt} setPersonaPrompt={setPersonaPrompt} />
          <SaveButtonsWrapper
            buttonColor={buttonColor}
            defaultPrompt={defaultPrompt}
            hasChange={hasChange}
            persona={persona}
            personaPrompt={personaPrompt}
            personas={personas}
            setPersonaPrompt={setPersonaPrompt}
            updateConfig={updateConfig}
            onOpen={onOpen}
          />
        </Box>
      </AccordionPanel>
      <PersonaModalWrapper
        isOpen={isOpen}
        personaPrompt={personaPrompt}
        personas={personas}
        updateConfig={updateConfig}
        onClose={onClose}
      />
      <DeleteModalWrapper
        isDeleteOpen={isDeleteOpen}
        persona={persona}
        personas={personas}
        updateConfig={updateConfig}
        onDeleteClose={onDeleteClose}
      />
    </AccordionItem>
  );
};

export { AutoResizeTextarea, Persona };
