import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

export default function FilterBar({ filters, values, onChange, onClear }) {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      {filters.map((filter) => {
        if (filter.type === 'search') {
          return (
            <div key={filter.key} className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={filter.placeholder || 'Buscar...'}
                value={values[filter.key] || ''}
                onChange={(e) => onChange(filter.key, e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
          );
        }
        return (
          <Select
            key={filter.key}
            value={values[filter.key] || 'all'}
            onValueChange={(v) => onChange(filter.key, v === 'all' ? '' : v)}
          >
            <SelectTrigger className="w-[160px] h-9 text-sm">
              <SelectValue placeholder={filter.placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {filter.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      })}
      {onClear && (
        <Button variant="ghost" size="sm" onClick={onClear} className="h-9 text-xs text-muted-foreground">
          <X className="w-3 h-3 mr-1" /> Limpar
        </Button>
      )}
    </div>
  );
}
