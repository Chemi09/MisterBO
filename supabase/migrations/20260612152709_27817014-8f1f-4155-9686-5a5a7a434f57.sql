
-- Tighten INSERT policies
DROP POLICY "anyone can create order" ON public.orders;
CREATE POLICY "create own or guest order" ON public.orders FOR INSERT TO anon, authenticated
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

DROP POLICY "items follow order insert" ON public.order_items;
CREATE POLICY "create items for existing order" ON public.order_items FOR INSERT TO anon, authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id));

DROP POLICY "auth users create reviews" ON public.reviews;
CREATE POLICY "auth create reviews" ON public.reviews FOR INSERT TO authenticated
  WITH CHECK (author_name IS NOT NULL AND length(comment) > 0);

-- handle_new_user is only invoked by the auth.users trigger, never directly
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
