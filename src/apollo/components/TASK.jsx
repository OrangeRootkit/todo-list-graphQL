import React, { useState } from "react";
import { ADD_TODO, ALL_TODOS } from "../todos";
import { useMutation } from "@apollo/client";

export const TASK = () => {
  const [task, addTask] = useState("");

  const handleChandge = (e) => {
    addTask(e.target.value);
  };

  const [addTodo, { loading, error, data }] = useMutation(ADD_TODO, {  // два значения:функция, и объект его деструктуризируем ,
    // refetchQueries: [{ query: ALL_TODOS }], // refetchQueries - динамическое обновление страницы, внутри массив с обновлениями, сетевой запрос который полность перезагружает запрос и обновляет кэш, чтобы обновлять кэш только новыми данным, нужно использовать update
    update(cache, { data: {newTodo} }) { //метод update принимает кэш из аполло, дата - данные из запроса и newTodo из запроса на мутацию, нужно деструктурировать
      const { todos } = cache.readQuery({ query: ALL_TODOS }); //деструктурируем todos присваиваем значение обращаемся к кэш.метод ридквери внутри квери запрос всех туду
      cache.writeQuery({ // перезаписываем кэш
        query: ALL_TODOS, // повторяем запрос который обновляем
        data: {
          todos: [newTodo, ...todos], // как в редаксе создаем новый массив, добавляем тудушку, разворачиваем остальной массив, который прочитали из запроса
        },
      });
    },
  }); 

  const handleClick = () => {
    addTodo({
      variables: {
        title: task,
        completed: false,
        user_id: 456,
      },
    });
  };

  return (
    <>
      <div>addtodo</div>
      <input type="text" onChange={(e) => handleChandge(e)}></input>
      <button onClick={handleClick} style={{ width: "100px", height: "20px" }}>
        push
      </button>
    </>
  );
};
