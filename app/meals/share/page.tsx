"use client";

import { useForm } from "react-hook-form";
import ImagePicker from "@/components/meals/ImagePicker";
import classes from "./page.module.css";
import { shareMeal } from "@/lib/utils/actions";
import MealsFormSubmit from "@/components/meals/MealsFormSubmit";

// Define your form data types
interface FormValues {
  name: string;
  email: string;
  title: string;
  summary: string;
  instructions: string;
  image: FileList; // Adjust this type if needed
}

export default function ShareMealPage() {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      name: '',
      email: '',
      title: '',
      summary: '',
      instructions: '',
      image: undefined,
    }
  });

  const { errors } = formState;

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('title', data.title);
    formData.append('summary', data.summary);
    formData.append('instructions', data.instructions);

    if (data.image.length > 0) {
      formData.append('image', data.image[0]);
    }

    try {
      await shareMeal(formData);
      // handle successful form submission (e.g., show a success message or redirect)
    } catch (error) {
      // handle error (e.g., show an error message)
    }
  };

  // Generate a list of error messages from `errors` object
  const errorMessages = Object.keys(errors).map(key => {
    const fieldError = errors[key as keyof FormValues];
    return fieldError?.message ? <p key={key}>{fieldError.message}</p> : null;
  });

  return (
    <>
      <header className={classes.header}>
        <h1>
          Share your <span className={classes.highlight}>favorite meal</span>
        </h1>
        <p>Or any other meal you feel needs sharing!</p>
      </header>
      <main className={classes.main}>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={classes.row}>
            <p>
              <label htmlFor="name">Your name</label>
              <input type="text" id="name" {...register('name', { required: "Name is required" })} />
            </p>
            <p>
              <label htmlFor="email">Your email</label>
              <input type="email" id="email" {...register('email', { required: "Email is required" })} />
            </p>
          </div>
          <p>
            <label htmlFor="title">Title</label>
            <input type="text" id="title" {...register('title', { required: "Title is required" })} />
          </p>
          <p>
            <label htmlFor="summary">Short Summary</label>
            <input type="text" id="summary" {...register('summary', { required: "Summary is required" })} />
          </p>
          <p>
            <label htmlFor="instructions">Instructions</label>
            <textarea
              id="instructions"
              {...register('instructions', { required: "Instructions are required" })}
              rows={10}
            ></textarea>
          </p>
          <ImagePicker label="Your Image" name="image" />
          {errorMessages.length > 0 && <div className={classes.errors}>{errorMessages}</div>}
          <p className={classes.actions}>
            <MealsFormSubmit />
          </p>
        </form>
      </main>
    </>
  );
}
