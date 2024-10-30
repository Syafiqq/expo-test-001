import { Header, HeaderBackButton } from '@react-navigation/elements';
import { type NativeStackHeaderProps } from '@react-navigation/native-stack';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import React, { memo, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { debounceTime, Subject } from 'rxjs';

import { useTodoRepository } from '@/api/repositoiry/todo';
import { ListPage } from '@/components/page/todo-catalogue/components/todo-list-layout';
import { TodoPageLoading } from '@/components/page/todo-catalogue/components/todo-page-loading';
import TodoSearch from '@/components/page/todo-catalogue/components/todo-search';
import { type TodoPresenter } from '@/components/page/todo-catalogue/todo-presenter';
import { toPresenter } from '@/components/page/todo-catalogue/todo-presenter+entity';
import {
  hideFilterAndOrder,
  hideSearch,
  showFilterAndOrder,
  showSearch,
} from '@/core/state/todo-catalogue-navigation-slice';
import { updateSearch } from '@/core/state/todo-catalogue-search-slice';
import { useAppDispatch, useAppSelector } from '@/core/state/use-redux';
import {
  colors,
  FocusAwareStatusBar,
  Modal,
  showErrorMessage,
  useModal,
} from '@/ui';
import { FaMagnifyingGlassSolid } from '@/ui/icons/fa-magnifying-glass-solid';
import { Sliders } from '@/ui/icons/sliders';

const ListPageMemo = memo(({ todos }: { todos: TodoPresenter[] }) => (
  <ListPage data={todos ?? []} />
));

// MARK: - Search Bar

const debouncedSearchBarSubject = new Subject<string>();
type DebouncedSearchBarProps = {
  onChangeText?: ((text: string) => void) | undefined;
};
const DebouncedSearchBar = ({ onChangeText }: DebouncedSearchBarProps) => {
  const [textSearch, setTextSearch] = useState('');

  useEffect(() => {
    const subscription = debouncedSearchBarSubject
      .pipe(debounceTime(1000))
      .subscribe((text) => {
        onChangeText?.(text);
      });
    return () => subscription.unsubscribe();
  }, [onChangeText]);

  useEffect(() => {
    debouncedSearchBarSubject.next(textSearch);
  }, [textSearch]);

  return (
    <Searchbar
      placeholder="Search"
      onChangeText={setTextSearch}
      value={textSearch}
    />
  );
};

// MARK: - Header

type TodoHeaderProps = NativeStackHeaderProps & {
  onFilterPress?: (() => void) | undefined;
};
const TodoHeader = (props: TodoHeaderProps) => {
  const isSearchShown = useAppSelector(
    (state) => state.todoCatalogueNavigation.isSearchShown,
  );
  const isFilterActive = useAppSelector(
    (state) => state.todoCatalogueNavigation.isFilterAndOrderShown,
  );

  const dispatch = useAppDispatch();

  const onChangeText = (text: string) => {
    dispatch(updateSearch(text));
  };

  return isSearchShown ? (
    <Header
      title="ToDo"
      {...props}
      headerLeft={() => (
        <HeaderBackButton onPress={() => dispatch(hideSearch())} />
      )}
      headerTitle={() => <DebouncedSearchBar onChangeText={onChangeText} />}
      headerTitleContainerStyle={{
        flex: 1,
        marginHorizontal: 0,
        maxWidth: '100%',
        marginEnd: 16,
      }}
      headerRightContainerStyle={{ flexGrow: 0 }}
    />
  ) : (
    <Header
      title="ToDo"
      {...props}
      headerRight={() => (
        <View className="mr-4 flex-row">
          <Pressable
            onPress={() => {
              dispatch(showSearch());
            }}
          >
            <View className="items-center p-2">
              <FaMagnifyingGlassSolid
                color={colors.charcoal[700]}
                width={20}
                height={20}
              />
            </View>
          </Pressable>
          {isFilterActive ? (
            <Pressable onPress={() => props.onFilterPress?.()}>
              <View className="items-center p-2">
                <Sliders color={colors.charcoal[700]} width={20} height={20} />
              </View>
            </Pressable>
          ) : null}
        </View>
      )}
    />
  );
};

// eslint-disable-next-line max-lines-per-function
export function TodoCatalogue() {
  const repository = useTodoRepository();
  const searchQuery = useAppSelector(
    (state) => state.todoCatalogueSearch.query,
  );
  const searchTextQuery = useAppSelector(
    (state) => state.todoCatalogueSearch.search,
  );
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const modal = useModal();

  const {
    isPending,
    isFetching,
    error,
    data: todos,
  } = useQuery({
    queryKey: ['todos'],
    queryFn: () => repository.getAllFromLocal(searchQuery, searchTextQuery),
    select: (data) => data.map(toPresenter),
    enabled: !!repository,
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  }, [queryClient, searchTextQuery]);

  useEffect(() => {
    if (error) {
      showErrorMessage(`Error loading posts ${error.message}`);
    }
  }, [error]);

  useEffect(() => {
    if (isPending || isFetching) {
      dispatch(hideFilterAndOrder());
    } else {
      dispatch(showFilterAndOrder());
    }
  }, [isPending, isFetching]);

  if (isPending) {
    return (
      <>
        <FocusAwareStatusBar />
        <TodoPageLoading />
      </>
    );
  }

  return (
    <>
      <FocusAwareStatusBar />
      <Modal ref={modal.ref} snapPoints={['95%']}>
        <TodoSearch
          savedQuery={searchQuery}
          useBottomSheet={true}
          onSearchCommitted={() => {
            modal.dismiss();
            queryClient.invalidateQueries({ queryKey: ['todos'] });
          }}
        />
      </Modal>
      <Stack.Screen
        options={{
          header: (props) => (
            <TodoHeader {...props} onFilterPress={() => modal.present()} />
          ),
        }}
      />
      <ListPageMemo todos={todos ?? []} />
    </>
  );
}
