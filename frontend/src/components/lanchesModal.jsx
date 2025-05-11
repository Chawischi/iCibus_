"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios from "axios";

const snackSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  price: z.coerce.number().positive("Preço deve ser maior que 0"),
  banner: z.instanceof(FileList).refine(files => files.length > 0, "Imagem obrigatória"),
});

export function SnackModal({ open, onOpenChange }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(snackSchema),
  });

  const [preview, setPreview] = useState(null);

  const onSubmit = async data => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price.toString());
      formData.append("banner", data.banner[0]);

      await axios.post("/api/snacks", formData);

      reset();
      setPreview(null);
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao adicionar lanche:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Lanche</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="price">Preço</Label>
            <Input id="price" type="number" step="0.01" {...register("price")} />
            {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
          </div>

          <div>
            <Label htmlFor="banner">Banner</Label>
            <Input
              id="banner"
              type="file"
              accept="image/*"
              {...register("banner")}
              onChange={e => {
                const file = e.target.files[0];
                if (file) setPreview(URL.createObjectURL(file));
              }}
            />
            {errors.banner && <p className="text-sm text-red-500">{errors.banner.message}</p>}
            {preview && <img src={preview} alt="Prévia" className="mt-2 w-full rounded" />}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adicionando..." : "Adicionar Lanche"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
