import logo from "./logo.svg";
import "./App.css";
import { useQuery } from "@apollo/client";
import { ALL_TODOS, UPDATE_TODO, REMOVE_TODO } from "./apollo/todos";
import { useMutation } from "@apollo/client";
import { TASK } from "./apollo/components/TASK";

function App() {
  const { loading, error, data } = useQuery(ALL_TODOS);
  const [toggleTodo, { error: updateError }] = useMutation(UPDATE_TODO);
  const [removeTodo, { error: removeError }] = useMutation(REMOVE_TODO, {
    update(cache, { data: { removeTodo } }) {  // функция update, первый аргумент кэш, второй дата который принмает объект removeTodo
      cache.modify({  // обращаемся к методу кэш модифай
        fields:{  // в модификации указываем что конкретно хотим поменять, поля - обязательное указание именно fields иначе работать не будет
          allTodos(currentTodos = []) { //указываем конкретные поля allTodos, название именно allTodos это функция которая принимает текущий список или пустой массив.
            return currentTodos.filter(el=>el.__ref!==`Todo:${removeTodo.id}`) // далее фильтруем массив, тк в query существует массив объектов нужно обращаться к ref и полному имени
          }
        }
      })
    },
  });

  if (loading) {
    console.log("loading");
    return <h2>loading</h2>;
  }

  if (error || updateError) {
    console.log("error");
    return <h2>error</h2>;
  }

  const arr = data.todos;
  const sum = data.todos.length;

  console.log(data);

  const handleChange = (id, comleted) => {
    // принимаю параметры на изменения
    toggleTodo({
      // запускаю функция на обновление задания через аполло
      variables: {
        // объект аполло с переменными которые изменяются
        id: id, // указание id объекта
        completed: !comleted, // меняем на противополжный id объекта
      },
    });
  };

  const handleRemove = (id) => {
    console.log("x");
    removeTodo({
      variables: {
        id: id,
      },
    });
  };

  // const [addTodo, { loading2, error2, data2 }] = useMutation(ADD_TODO); // два значения:функция, и объект его деструктуризируем

  // const handleClick = () => {
  //   addTodo({
  //     variables: {
  //       id,
  //       title,
  //       completed,
  //     },
  //   });
  // };

  return (
    <>
      <ul>
        {data.todos.map((el, i) => (
          <div style={{ display: "flex" }}>
            <input
              style={{ marginRight: "20px" }}
              type="checkbox"
              onChange={() => handleChange(el.id, el.completed)}
            />
            <li
              key={i}
              style={
                el.completed === true ? { color: "blue" } : { color: "black" }
              }
            >
              {el.title}
            </li>
            <span
              style={{ marginLeft: "20px", color: "red" }}
              onClick={() => handleRemove(el.id)}
            >
              X
            </span>
          </div>
        ))}
      </ul>
      {sum && <b>{`итого ${sum}`}</b>}
      <TASK />
    </>
  );
}

export default App;
