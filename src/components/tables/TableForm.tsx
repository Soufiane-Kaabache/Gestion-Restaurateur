'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TableData } from './TableCard';

interface TableFormProps {
  table?: TableData | null;
  onSubmit: (table: any) => void;
  onCancel: () => void;
}

export function TableForm({ table, onSubmit, onCancel }: TableFormProps) {
  const [formData, setFormData] = useState({
    number: '',
    capacity: '',
    section: '',
    positionX: '0',
    positionY: '0',
  });

  useEffect(() => {
    if (table) {
      setFormData({
        number: table.number.toString(),
        capacity: table.capacity.toString(),
        section: table.section || '',
        positionX: table.positionX.toString(),
        positionY: table.positionY.toString(),
      });
    }
  }, [table]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tableData = {
      number: parseInt(formData.number),
      capacity: parseInt(formData.capacity),
      section: formData.section || undefined,
      positionX: parseFloat(formData.positionX),
      positionY: parseFloat(formData.positionY),
      status: 'LIBRE' as const,
    };

    if (table) {
      onSubmit({ ...tableData, id: table.id });
    } else {
      onSubmit(tableData);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{table ? 'Modifier la table' : 'Créer une nouvelle table'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="number">Numéro</Label>
              <Input
                id="number"
                type="number"
                value={formData.number}
                onChange={(e) => handleChange('number', e.target.value)}
                placeholder="1"
                required
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacité</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => handleChange('capacity', e.target.value)}
                placeholder="4"
                required
                min="1"
                max="20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="section">Section (optionnel)</Label>
            <Select
              value={formData.section}
              onValueChange={(value) => handleChange('section', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucune</SelectItem>
                <SelectItem value="terrasse">Terrasse</SelectItem>
                <SelectItem value="salle">Salle principale</SelectItem>
                <SelectItem value="privé">Salle privée</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
                <SelectItem value="extérieur">Extérieur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="positionX">Position X</Label>
              <Input
                id="positionX"
                type="number"
                value={formData.positionX}
                onChange={(e) => handleChange('positionX', e.target.value)}
                placeholder="0"
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="positionY">Position Y</Label>
              <Input
                id="positionY"
                type="number"
                value={formData.positionY}
                onChange={(e) => handleChange('positionY', e.target.value)}
                placeholder="0"
                step="0.1"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit">{table ? 'Modifier' : 'Créer'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
