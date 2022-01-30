import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    const result = await axios.post(
      `https://api.makor-x.com/authentication/ms_login`,
      data,
    );
    if (result.status === 200) {
      const resToken = await axios.post(
        `http://localhost:3001/users/login`,
        data,
      );
      const token = "Bearer " + resToken.data.token;
      sessionStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = token;
      navigate("/home");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* register your input into the hook by invoking the "register" function */}
      <input {...register("username", { required: true })} />
      {errors.username && <span>This field is required</span>}
      {/* include validation with required or other standard HTML validation rules */}
      <input type={"password"} {...register("password", { required: true })} />
      {/* errors will return when field validation fails  */}
      {errors.password && <span>This field is required</span>}
      <input type="submit" />
    </form>
  );
};
