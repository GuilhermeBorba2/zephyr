import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToastStore } from '../../stores/toastStore';

interface SatisfactionRatingFormProps {
  ticketId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const SatisfactionRatingForm: React.FC<SatisfactionRatingFormProps> = ({
  ticketId,
  onSuccess,
  onCancel
}) => {
  const addToast = useToastStore(state => state.addToast);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      addToast('Por favor, selecione uma nota', 'error');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('satisfaction_ratings')
        .insert([{
          ticket_id: ticketId,
          rating,
          comment: comment.trim() || null
        }]);

      if (error) throw error;
      
      addToast('Avaliação enviada com sucesso!', 'success');
      onSuccess();
    } catch (error) {
      console.error('Error submitting rating:', error);
      addToast('Erro ao enviar avaliação', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Como você avalia o atendimento recebido?
        </p>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoveredStar(value)}
              onMouseLeave={() => setHoveredStar(0)}
              className="p-1 focus:outline-none"
            >
              <Star
                className={`w-8 h-8 ${
                  value <= (hoveredStar || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {rating === 1 && 'Muito insatisfeito'}
          {rating === 2 && 'Insatisfeito'}
          {rating === 3 && 'Neutro'}
          {rating === 4 && 'Satisfeito'}
          {rating === 5 && 'Muito satisfeito'}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Comentários (opcional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows={4}
          placeholder="Conte-nos mais sobre sua experiência..."
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Enviar Avaliação'}
        </button>
      </div>
    </form>
  );
};

export default SatisfactionRatingForm;