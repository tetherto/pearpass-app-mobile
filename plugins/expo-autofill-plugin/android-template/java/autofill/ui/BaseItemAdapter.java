package com.pears.pass.autofill.ui;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

/**
 * Base adapter class for RecyclerView adapters.
 * Consolidates common functionality like list management and click handling.
 *
 * @param <T> The item type
 * @param <VH> The ViewHolder type
 */
public abstract class BaseItemAdapter<T, VH extends RecyclerView.ViewHolder>
        extends RecyclerView.Adapter<VH> {

    protected List<T> items;

    public BaseItemAdapter(List<T> items) {
        this.items = items;
    }

    /**
     * Update the list of items and refresh the adapter.
     * @param newItems The new list of items
     */
    public void updateList(List<T> newItems) {
        this.items = newItems;
        notifyDataSetChanged();
    }

    @Override
    public int getItemCount() {
        return items != null ? items.size() : 0;
    }

    /**
     * Get the item at the specified position.
     * @param position The position in the list
     * @return The item at the position
     */
    protected T getItem(int position) {
        return items.get(position);
    }

    @Override
    public void onBindViewHolder(@NonNull VH holder, int position) {
        T item = getItem(position);
        onBindItem(holder, item);
    }

    /**
     * Bind the item to the view holder.
     * Subclasses should implement this method instead of onBindViewHolder.
     * @param holder The ViewHolder
     * @param item The item to bind
     */
    protected abstract void onBindItem(@NonNull VH holder, T item);
}